from flask import Blueprint, request, jsonify
from app.models import db, ApiRequest
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

api_request_routes = Blueprint('api_request_routes', __name__)

# POSTエンドポイント：APIリクエストをデータベースに保存する
@api_request_routes.route('/api_requests', methods=['POST'])
def create_api_request():
    try:
        data = request.get_json()
        new_api_request = ApiRequest(
            user_id=data['user_id'],
            requested_at=datetime.now(),
            api_name=data['api_name'],
            result=data['result'],
            error_message=data.get('error_message', '')
        )
        db.session.add(new_api_request)
        db.session.commit()
        return jsonify({"message": "API request recorded successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# GETエンドポイント：特定のAPIリクエストを取得する
@api_request_routes.route('/api_requests/<int:id>', methods=['GET'])
def get_api_request(id):
    api_request = ApiRequest.query.get(id)
    if api_request:
        return jsonify({
            "id": api_request.id,
            "user_id": api_request.user_id,
            "requested_at": api_request.requested_at,
            "api_name": api_request.api_name,
            "result": api_request.result,
            "error_message": api_request.error_message
        }), 200
    return jsonify({"error": "API request not found"}), 404

# GETエンドポイント：特定のユーザーのAPIリクエスト履歴を取得する
@api_request_routes.route('/api_requests/user/<user_id>', methods=['GET'])
def get_user_api_requests(user_id):
    api_requests = ApiRequest.query.filter_by(user_id=user_id).all()
    if api_requests:
        return jsonify([{
            "id": api_request.id,
            "requested_at": api_request.requested_at,
            "api_name": api_request.api_name,
            "result": api_request.result,
            "error_message": api_request.error_message
        } for api_request in api_requests]), 200
    return jsonify({"error": "No API requests found for this user"}), 404
