from flask import Blueprint, request, jsonify
from app.models import db, Recommendation
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

recommend_routes = Blueprint('recommend', __name__)

# POSTエンドポイント：新規のおすすめおみやげ情報を作成する
@recommend_routes.route('', methods=['POST'])
def create_recommend():
    try:
        data = request.json
        
        # 既存の店舗と商品がDBに存在しない場合は作成
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({"error": "Product not found"}), 404
        
        store = Store.query.get(data['store_id'])
        if not store:
            return jsonify({"error": "Store not found"}), 404

        # 新しいRecommendationの作成
        new_recommend = Recommendation(
            condition_id=data['condition_id'],
            product_id=product.id,
            store_id=store.id,
            recommended_at=data.get('recommended_at', datetime.now())
        )
        db.session.add(new_recommend)
        db.session.commit()
        return jsonify({"message": "Recommendation created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# GETエンドポイント：特定のおすすめおみやげ情報を取得する
@recommend_routes.route('/<int:id>', methods=['GET'])
def get_recommend(id):
    recommend = Recommendation.query.get(id)
    if recommend:
        return jsonify({
            "id": recommend.id,
            "condition_id": recommend.condition_id,
            "product_id": recommend.product_id,
            "store_id": recommend.store_id,
            "recommended_at": recommend.recommended_at,
            "comment": recommend.comment
        }), 200
    return jsonify({"error": "Recommendation not found"}), 404

# GETエンドポイント：特定の条件に基づくすべてのおすすめおみやげ情報を取得する
@recommend_routes.route('/condition/<int:condition_id>', methods=['GET'])
def get_condition_recommends(condition_id):
    recommends = Recommendation.query.filter_by(condition_id=condition_id).all()
    return jsonify([{
        "id": recommend.id,
        "product_id": recommend.product_id,
        "store_id": recommend.store_id,
        "recommended_at": recommend.recommended_at,
        "comment": recommend.comment
    } for recommend in recommends]), 200
