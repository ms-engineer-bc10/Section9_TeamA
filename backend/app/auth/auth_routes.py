from flask import Blueprint, request, jsonify
from app.auth.auth_service import verify_id_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    id_token = request.headers.get('Authorization').split(' ')[1]
    try:
        uid = verify_id_token(id_token)
        # uidを使ってユーザーを作成または更新
        return jsonify({"uid": uid}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
