from flask import Blueprint, request, jsonify
from app.models import db, Condition
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

condition_routes = Blueprint('condition_routes', __name__)

# POSTエンドポイント：条件データをデータベースに保存
@condition_routes.route('/conditions', methods=['POST'])
def create_condition():
    try:
        data = request.get_json()
        new_condition = Condition(
            user_id=data['user_id'],
            target=data['target'],
            genre=data['genre'],
            budget_min=data['budget_min'],
            budget_max=data['budget_max'],
            quantity=data['quantity'],
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            prefecture_name=data.get('prefecture_name', ''),
            searched_at=datetime.now()
        )
        db.session.add(new_condition)
        db.session.commit()
        return jsonify({"message": "Condition created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# GETエンドポイント：特定の条件データを取得
@condition_routes.route('/conditions/<int:id>', methods=['GET'])
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
@condition_routes.route('/conditions/user/<user_id>', methods=['GET'])
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
