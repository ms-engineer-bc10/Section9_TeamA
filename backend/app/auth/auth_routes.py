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
        return jsonify({
            "message": "User registered successfully", 
            "uid": uid,
            "email": user.email
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to register user: {str(e)}"}), 500

@auth_bp.route('/user', methods=['POST'])
@verify_token
def update_user():
    try:
        uid = request.uid
        user_data = request.json
        user = create_or_update_user(uid, user_data.get('email'))
        return jsonify({
            "message": "User updated successfully", 
            "uid": uid,
            "email": user.email
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update user: {str(e)}"}), 500

@auth_bp.route('/user', methods=['GET'])
@verify_token
def get_user():
    try:
        uid = request.uid
        user = User.query.get(uid)
        if user:
            return jsonify({
                "uid": user.uid,
                "email": user.email,
                "name": user.name,
                "age": user.age,
                "gender": user.gender,
                "registered_at": user.registered_at,
                "latest_login_at": user.latest_login_at,
                "condition_count": user.condition_count,
                "recommend_count": user.recommend_count
            }), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to get user: {str(e)}"}), 500