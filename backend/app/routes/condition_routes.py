from flask import Blueprint, request, jsonify
from app.models import db, Condition
from sqlalchemy.exc import SQLAlchemyError

condition_routes = Blueprint('condition', __name__)

@condition_routes.route('', methods=['POST'])
def create_condition():
    try:
        data = request.json
        new_condition = Condition(
            uid=data['uid'],
            target=data['target'],
            genre=data['genre'],
            budget=data['budget'],
            quantity=data['quantity']
        )
        db.session.add(new_condition)
        db.session.commit()
        return jsonify({"message": "Condition created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@condition_routes.route('/<int:id>', methods=['GET'])
def get_condition(id):
    condition = Condition.query.get(id)
    if condition:
        return jsonify({
            "id": condition.id,
            "uid": condition.uid,
            "target": condition.target,
            "genre": condition.genre,
            "budget": condition.budget,
            "quantity": condition.quantity,
            "searched_at": condition.searched_at
        }), 200
    return jsonify({"error": "Condition not found"}), 404

@condition_routes.route('/user/<uid>', methods=['GET'])
def get_user_conditions(uid):
    conditions = Condition.query.filter_by(uid=uid).all()
    return jsonify([{
        "id": condition.id,
        "target": condition.target,
        "genre": condition.genre,
        "budget": condition.budget,
        "quantity": condition.quantity,
        "searched_at": condition.searched_at
    } for condition in conditions]), 200