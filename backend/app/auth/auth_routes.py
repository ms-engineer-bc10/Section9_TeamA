# app/auth/auth_routes.py

from flask import Blueprint, request, jsonify
from .auth_utils import verify_token
from .auth_service import create_or_update_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@verify_token
def register_user():
    try:
        uid = request.uid
        user_data = request.json
        user = create_or_update_user(uid, user_data.get('email'))
        return jsonify({"message": "User registered successfully", "uid": uid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/user', methods=['POST'])
@verify_token
def update_user():
    try:
        uid = request.uid
        user_data = request.json
        user = create_or_update_user(uid, user_data.get('email'))
        return jsonify({"message": "User updated successfully", "uid": uid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500