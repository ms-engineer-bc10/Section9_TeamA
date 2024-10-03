from flask import Blueprint, request, jsonify
from app.models import db, ApiRequest
from sqlalchemy.exc import SQLAlchemyError

api_request_routes = Blueprint('api_request', __name__)

@api_request_routes.route('', methods=['POST'])
def create_api_request():
    try:
        data = request.json
        new_api_request = ApiRequest(
            uid=data['uid'],
            api_name=data['api_name'],
            result=data['result'],
            error_message=data['error_message']
        )
        db.session.add(new_api_request)
        db.session.commit()
        return jsonify({"message": "API request recorded successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api_request_routes.route('/<int:id>', methods=['GET'])
def get_api_request(id):
    api_request = ApiRequest.query.get(id)
    if api_request:
        return jsonify({
            "id": api_request.id,
            "uid": api_request.uid,
            "requested_at": api_request.requested_at,
            "api_name": api_request.api_name,
            "result": api_request.result,
            "error_message": api_request.error_message
        }), 200
    return jsonify({"error": "API request not found"}), 404

@api_request_routes.route('/user/<uid>', methods=['GET'])
def get_user_api_requests(uid):
    api_requests = ApiRequest.query.filter_by(uid=uid).all()
    return jsonify([{
        "id": api_request.id,
        "requested_at": api_request.requested_at,
        "api_name": api_request.api_name,
        "result": api_request.result,
        "error_message": api_request.error_message
    } for api_request in api_requests]), 200