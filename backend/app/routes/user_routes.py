from flask import Blueprint, request, jsonify
from app.services.openai_service import get_openai_recommendation
from app.services.yahoo_service import search_yahoo_shopping
from app.services.google_service import search_google_places
from app.models import db, User
from sqlalchemy.exc import SQLAlchemyError

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.json
    recipient = data.get('recipient')
    price = data.get('price')
    quantity = data.get('quantity')
    location = data.get('location')
    price_from, price_to = parse_price(price)
    shopping_results = search_yahoo_shopping(price_from, price_to)

    selected_product = shopping_results['hits'][0]
    ai_input_data = {
        'recipient': recipient,
        'category': data.get('category'),
        'price': price,
        'quantity': quantity,
        'location': location,
        'selected_product': selected_product
    }

    ai_recommend = get_openai_recommendation(ai_input_data)

    places_results = search_google_places(location, radius=1000)

    return generate_recommendation_response(shopping_results, ai_recommend, places_results)

def parse_price(price_str):
    # 「¥」「,」を削除
    price_str = price_str.replace('¥', '').replace(',', '').strip()

    if '〜' in price_str:  # 範囲指定の場合
        price_range = price_str.split('〜')
        price_from = int(price_range[0]) if price_range else 0
        price_to = int(price_range[1]) if len(price_range) > 1 else 999999
    else:  # "¥10,000〜"の場合
        if price_str.endswith('〜'):
            price_from = int(price_str[:-1])  # 最後の「〜」を削除
            price_to = 999999  # デフォルトで上限を設定
        else:
            price_from = int(price_str)
            price_to = int(price_str)

    return price_from, price_to

def generate_recommendation_response(shopping_results, ai_recommend, places_results):
    formatted_shopping_results = []
    for item in shopping_results.get('hits', []):
        product = {
            '商品名': item.get('name', '不明'),
            '価格': item.get('price', '不明'),
            '個数': item.get('quantity', '不明'),
            '説明': item.get('description', '説明なし'),
            '画像URL': item.get('image', {}).get('medium', '画像なし'),
            '商品URL': item.get('url', 'URLなし')
        }
        formatted_shopping_results.append(product)

    return jsonify({
        'おすすめ商品一覧': formatted_shopping_results,
        'AIが選ぶおすすめ商品': formatted_shopping_results[0]['商品名'],
        'AIおすすめポイント': ai_recommend,
        '近隣店舗': places_results
    })


# 以下、ユーザー関連の CRUD 操作を追加

@user_routes.route('', methods=['POST'])
def create_user():
    try:
        data = request.json
        new_user = User(
            uid=data['uid'],
            name=data['name'],
            email=data['email'],
            age=data['age'],
            gender=data['gender']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@user_routes.route('/<uid>', methods=['GET'])
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
            "recomend_count": user.recomend_count
        }), 200
    return jsonify({"error": "User not found"}), 404

@user_routes.route('/<uid>', methods=['PUT'])
def update_user(uid):
    try:
        user = User.query.get(uid)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.json
        for key, value in data.items():
            setattr(user, key, value)
        
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@user_routes.route('/<uid>', methods=['DELETE'])
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