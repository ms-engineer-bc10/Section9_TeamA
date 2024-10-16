from flask import Blueprint, request, jsonify
from app.models import db, Condition
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from app.utils.budget_utils import parse_budget
from app.services.google_geocoding_service import get_prefecture_from_latlng, get_latlng_from_prefecture

condition_routes = Blueprint('condition_routes', __name__)

# POSTエンドポイント：条件データをデータベースに保存
@condition_routes.route('', methods=['POST'])
def save_condition():
    try:
        data = request.get_json()

        # 1. 予算を解析
        budget = data.get('budget')
        budget_from, budget_to = parse_budget(budget)

        # 2. location_typeに基づいて処理を分ける
        location = data.get('location')
        location_type = data.get('location_type')

        if location_type == 'latlng':
            # 緯度経度情報が提供されている場合
            latitude, longitude = map(float, location.split(','))
            prefecture_name = get_prefecture_from_latlng(location)  # 緯度経度から都道府県名を取得
        elif location_type == 'prefecture':
            # 都道府県名が提供されている場合
            prefecture_name = location
            latlng = get_latlng_from_prefecture(prefecture_name)  # 都道府県名から緯度経度を取得
            if latlng:
                latitude, longitude = map(float, latlng.split(','))
            else:
                return jsonify({'error': 'Invalid prefecture name'}), 400
        else:
            return jsonify({'error': 'Invalid location_type'}), 400

        # 3. データベースに保存
        new_condition = Condition(
            user_id=1,  # ダミーのユーザーID
            target=data['target'],
            genre=data['genre'],
            budget_min=budget_from,
            budget_max=budget_to,
            quantity=data['quantity'],
            latitude=latitude,
            longitude=longitude,
            prefecture_name=prefecture_name,
            searched_at=datetime.now()
        )
        db.session.add(new_condition)
        db.session.commit()

        return jsonify({"message": "Condition created successfully"}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

# GETエンドポイント：特定のuser_idとcondition_idに基づいて条件データを取得
@condition_routes.route('/<int:user_id>/<int:condition_id>', methods=['GET'])
def get_user_condition(user_id, condition_id):
    condition = Condition.query.filter_by(user_id=user_id, id=condition_id).first()
    if condition:
        return jsonify({
            "id": condition.id,
            "user_id": condition.user_id,
            "target": condition.target,
            "genre": condition.genre,
            "budget_min": condition.budget_min,
            "budget_max": condition.budget_max,
            "quantity": condition.quantity,
            "latitude": condition.latitude,
            "longitude": condition.longitude,
            "prefecture_name": condition.prefecture_name,
            "searched_at": condition.searched_at
        }), 200
    return jsonify({"error": "Condition not found"}), 404


# GETエンドポイント：特定の条件データを取得
@condition_routes.route('/<int:id>', methods=['GET'])
def get_condition(id):
    condition = Condition.query.get(id)
    if condition:
        return jsonify({
            "id": condition.id,
            "user_id": condition.user_id,
            "target": condition.target,
            "genre": condition.genre,
            "budget_min": condition.budget_min,
            "budget_max": condition.budget_max,
            "quantity": condition.quantity,
            "latitude": condition.latitude,
            "longitude": condition.longitude,
            "prefecture_name": condition.prefecture_name,
            "searched_at": condition.searched_at
        }), 200
    return jsonify({"error": "Condition not found"}), 404

# GETエンドポイント：特定ユーザーの条件データを取得
@condition_routes.route('/user/<int:id>', methods=['GET'])
def get_user_conditions(user_id):
    conditions = Condition.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": condition.id,
        "target": condition.target,
        "genre": condition.genre,
        "budget_min": condition.budget_min,
        "budget_max": condition.budget_max,
        "quantity": condition.quantity,
        "latitude": condition.latitude,
        "longitude": condition.longitude,
        "prefecture_name": condition.prefecture_name,
        "searched_at": condition.searched_at
    } for condition in conditions]), 200
