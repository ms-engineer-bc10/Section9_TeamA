import traceback
import logging
from flask import Blueprint, request, jsonify
from app.services.openai_service import get_openai_recommendation
from app.services.yahoo_service import search_yahoo_shopping
from app.services.google_service import search_google_places
from app.services.google_geocoding_service import get_prefecture_from_latlng
from app.services.recommendation_service import save_recommendation
from app.services.product_service import save_selected_product
from app.services.condition_service import save_condition
from app.services.store_service import save_store
from app.utils.budget_utils import parse_budget
from app.utils.response_utils import generate_recommendation_response
from app.models import db, User
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/recommend', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        print(data)
        # 条件の保存処理を呼び出し、condition_idを取得
        save_result, status = save_condition(data)
        if status != 201:
            print(f"Error saving condition: {save_result}", flush=True)#10/20
            
            return jsonify(save_result), status

        condition_id = save_result.get('condition_id')  # 保存した条件のIDを取得
        print(f"Condition saved with ID: {condition_id}", flush=True)#10/20
        
        # 1. 予算を解析
        budget = data.get('budget')
        budget_from, budget_to = parse_budget(budget)
        print(f"Parsed budget: {budget_from} to {budget_to}")
        

        # 2. locationの処理
        location = data.get('location')
        if "," in location:
            print(f"Location is latlng format: {location}")
            
            location = get_prefecture_from_latlng(location)
            print(f"Converted latlng to prefecture: {location}")
            

        print(f"Fetching Yahoo Shopping results for location: {location} and budget: {budget_from} to {budget_to}")
        
        shopping_results = search_yahoo_shopping(location, budget_from, budget_to)
        if not shopping_results:
            return jsonify({"error": "No shopping results found"}), 500
        
        print(f"Yahoo Shopping results: {shopping_results}", flush=True)#10/20
        

        for idx, item in enumerate(shopping_results):
            item['id'] = idx

        ai_input_data = {
            'target': data.get('target'),
            'genre': data.get('genre'),
            'budget': budget,
            'quantity': data.get('quantity'),
            'location': location,
            'shopping_results': shopping_results
        }

        print("Fetching AI recommendation...")
        
        ai_recommend, selected_product = get_openai_recommendation(ai_input_data)
        if not ai_recommend or not selected_product:
            return jsonify({"error": "AI recommendation failed"}), 500

        # 商品を保存し、product_idを取得
        product_id, status = save_selected_product(
            name=selected_product.get('name', '不明'),
            price=selected_product.get('price', 0),
            picture=selected_product.get('image_url', '画像なし'),
            ai_recommend=ai_recommend
        )
        if status != 201:
            return jsonify({'error': 'Product could not be saved'}), 500

        recommendations_data = {
            'target': data.get('target'),
            'genre': data.get('genre'),
            'budget': budget,
            'quantity': data.get('quantity'),
            'location': location,
            'shopping_results': shopping_results
        }

        print(f"Fetching nearby places for location: {location}")
        
        places_results = search_google_places(location, recommendations_data, radius=1000)
        if not places_results:
            return jsonify({"error": "No places found"}), 500

        # 1つのstore情報をDBに保存する（最初の店舗を保存）
        first_place = places_results[0]  # 1つ目の店舗情報を取得
        saved_store = save_store(first_place)  # その店舗をDBに保存
        if isinstance(saved_store, dict) and 'error' in saved_store:
            return jsonify(saved_store), 500

        store_id = saved_store.id  # 保存された店舗のIDを取得

        # recommendationテーブルを介してconditionとproduct/storeを紐づける
        save_recommendation(condition_id, product_id, store_id)

        # ユーザーに複数の店舗情報を返す、DBに保存
        response = generate_recommendation_response(shopping_results, selected_product, ai_recommend, places_results)

        return response

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500


# 以下、ユーザー関連の CRUD 操作を追加　下記もservice層に分けることを検討

# POSTエンドポイント：新規ユーザーを作成
@user_routes.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = User(
            uid=data['uid'],
            name=data['name'],
            email=data['email'],
            age=data.get('age'),
            gender=data.get('gender'),
            registered_at=datetime.now()
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# GETエンドポイント：特定のユーザー情報を取得
@user_routes.route('/users/<uid>', methods=['GET'])
def get_user(uid):
    user = User.query.get(uid)
    if user:
        return jsonify({
            "uid": user.uid,
            "name": user.name,
            "email": user.email,
            "age": user.age,
            "gender": user.gender,
            "registered_at": user.registered_at,
            "latest_login_at": user.latest_login_at,
            "condition_count": user.condition_count,
            "recommend_count": user.recommend_count
        }), 200
    return jsonify({"error": "User not found"}), 404

# PUTエンドポイント：特定のユーザー情報を更新
@user_routes.route('/users/<uid>', methods=['PUT'])
def update_user(uid):
    try:
        user = User.query.get(uid)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.get_json()
        for key, value in data.items():
            setattr(user, key, value)
        
        user.latest_login_at = datetime.now()
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# DELETEエンドポイント：特定のユーザーを削除
@user_routes.route('/users/<uid>', methods=['DELETE'])
def delete_user(uid):
    try:
        user = User.query.get(uid)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        db.session.delete(user)
        db.session.commit()
        return "", 204
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
