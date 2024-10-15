from flask import Blueprint, request, jsonify
from .auth_utils import verify_token
from .auth_service import create_or_update_user

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/user', methods=['POST'])
@verify_token
def create_user():
    data = request.json
    email = data.get('email')
    uid = request.uid  # verify_tokenデコレータによって設定されたUID

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        user = create_or_update_user(uid, email)
        return jsonify({
            "message": "User created/updated successfully",
            "user": {
                "uid": user.uid,
                "email": user.email,
                "registered_at": user.registered_at,
                "latest_login_at": user.latest_login_at
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500