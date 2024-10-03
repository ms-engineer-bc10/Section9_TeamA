from flask import Blueprint, request, jsonify
from app.models import db, Recommend
from sqlalchemy.exc import SQLAlchemyError

recommend_routes = Blueprint('recommend', __name__)

@recommend_routes.route('', methods=['POST'])
def create_recommend():
    try:
        data = request.json
        new_recommend = Recommend(
            condition_id=data['condition_id'],
            product_name=data['product_name'],
            product_url=data['product_url'],
            product_price=data['product_price'],
            store_id=data['store_id'],
            comment=data['comment']
        )
        db.session.add(new_recommend)
        db.session.commit()
        return jsonify({"message": "Recommendation created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@recommend_routes.route('/<int:id>', methods=['GET'])
def get_recommend(id):
    recommend = Recommend.query.get(id)
    if recommend:
        return jsonify({
            "id": recommend.id,
            "condition_id": recommend.condition_id,
            "product_name": recommend.product_name,
            "product_url": recommend.product_url,
            "product_price": recommend.product_price,
            "store_id": recommend.store_id,
            "recommended_at": recommend.recommended_at,
            "comment": recommend.comment
        }), 200
    return jsonify({"error": "Recommendation not found"}), 404

@recommend_routes.route('/condition/<int:condition_id>', methods=['GET'])
def get_condition_recommends(condition_id):
    recommends = Recommend.query.filter_by(condition_id=condition_id).all()
    return jsonify([{
        "id": recommend.id,
        "product_name": recommend.product_name,
        "product_url": recommend.product_url,
        "product_price": recommend.product_price,
        "store_id": recommend.store_id,
        "recommended_at": recommend.recommended_at,
        "comment": recommend.comment
    } for recommend in recommends]), 200