from flask import Blueprint, request, jsonify
from firebase_admin import auth as firebase_auth
from functools import wraps
from .auth_service import create_or_update_user

auth_routes = Blueprint('auth', __name__)

#ここ何するのか、、、
# デコレータ: トークンを検証し、UIDをリクエストに追加
def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            return jsonify({"error": "Authorization header is missing"}), 401

        parts = auth_header.split()
        if parts[0].lower() != 'bearer':
            return jsonify({"error": "Authorization header must start with 'Bearer'"}), 401
        elif len(parts) == 1:
            return jsonify({"error": "Token not found"}), 401
        elif len(parts) > 2:
            return jsonify({"error": "Authorization header must be a Bearer token"}), 401

        id_token = parts[1]

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)  # FirebaseのIDトークンを検証
            request.uid = decoded_token['uid']  # UIDをリクエストにセット
            print(f"IDトークン検証が成功しました。UID: {request.uid}")
        except Exception as e:
            print(f"IDトークンの検証に失敗しました: {e}")
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(*args, **kwargs)

    return decorated_function

# ユーザーの作成/更新ルート
@auth_routes.route('/user', methods=['POST'])
@verify_token  # トークンの検証を行う
def create_user():
    data = request.json
    email = data.get('email')
    uid = request.uid  # verify_tokenデコレータによって設定されたUID

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        # UIDとemailを使ってユーザーを作成または更新
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
        print(f"ユーザーの作成/更新に失敗しました: {e}")
        return jsonify({"error": str(e)}), 500