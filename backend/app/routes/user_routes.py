from flask import Blueprint, request, jsonify
from app.services.openai_service import get_openai_recommendation
from app.services.yahoo_service import search_yahoo_shopping
from app.services.google_service import search_google_places
from app.utils.budget_utils import parse_budget
from app.utils.response_utils import generate_recommendation_response
from app.models import db, User
from sqlalchemy.exc import SQLAlchemyError

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.json
    print(f"Received data: {data}")

    if not data:
        return jsonify({"error": "No data received"}), 400

    budget = data.get('budget')
    if not budget:
        return jsonify({"error": "Budget is required"}), 400
    
    target = data.get('target')
    budget = data.get('budget')
    quantity = data.get('quantity')
    location = data.get('location')
    budget_from, budget_to = parse_budget(budget)
    shopping_results = search_yahoo_shopping(budget_from, budget_to)
    print(f"Shopping results: {shopping_results}")

    ai_input_data = {
        'target': target,
        'genre': data.get('genre'),
        'budget': budget,
        'quantity': quantity,
        'location': location,
        'shopping_results': shopping_results
    }
    print(f"AI Input Data: {ai_input_data}")

    ai_recommend, selected_product = get_openai_recommendation(ai_input_data)


    places_results = search_google_places(location, radius=1000)

    return generate_recommendation_response(shopping_results, selected_product, ai_recommend, places_results)

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