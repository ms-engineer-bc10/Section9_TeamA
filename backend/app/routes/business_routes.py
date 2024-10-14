from flask import Blueprint, request, jsonify
from app.models import db, Business
from sqlalchemy.exc import SQLAlchemyError

business_routes = Blueprint('business_routes', __name__)

# POSTエンドポイント：新規ビジネスユーザーを作成
@business_routes.route('/businesses', methods=['POST'])
def create_business():
    try:
        data = request.get_json()
        new_business = Business(
            id=data['id'],
            stripe_auth=data['stripe_auth'],
            payment_reg_at=data['payment_reg_at'],
            user_id=data['user_id']
        )
        db.session.add(new_business)
        db.session.commit()
        return jsonify({"message": "Business created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# GETエンドポイント：特定のビジネスユーザー情報を取得
@business_routes.route('/businesses/<id>', methods=['GET'])
def get_business(id):
    business = Business.query.get(id)
    if business:
        return jsonify({
            "id": business.id,
            "stripe_auth": business.stripe_auth,
            "payment_reg_at": business.payment_reg_at,
            "user_id": business.user_id
        }), 200
    return jsonify({"error": "Business not found"}), 404

# GETエンドポイント：すべてのビジネスユーザー情報を取得
@business_routes.route('/businesses', methods=['GET'])
def get_all_businesses():
    businesses = Business.query.all()
    return jsonify([{
        "id": business.id,
        "stripe_auth": business.stripe_auth,
        "payment_reg_at": business.payment_reg_at,
        "user_id": business.user_id
    } for business in businesses]), 200

# PUTエンドポイント：特定のビジネスユーザー情報を更新
@business_routes.route('/businesses/<id>', methods=['PUT'])
def update_business(id):
    business = Business.query.get(id)
    if not business:
        return jsonify({"error": "Business not found"}), 404
    
    try:
        data = request.get_json()
        business.stripe_auth = data.get('stripe_auth', business.stripe_auth)
        business.payment_reg_at = data.get('payment_reg_at', business.payment_reg_at)
        db.session.commit()
        return jsonify({"message": "Business updated successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# DELETEエンドポイント：特定のビジネスユーザーを削除
@business_routes.route('/businesses/<id>', methods=['DELETE'])
def delete_business(id):
    business = Business.query.get(id)
    if not business:
        return jsonify({"error": "Business not found"}), 404
    
    try:
        db.session.delete(business)
        db.session.commit()
        return jsonify({"message": "Business deleted successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
