from firebase_admin import auth
from functools import wraps
from flask import request, jsonify

def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = request.headers.get('Authorization')
        if not id_token:
            return jsonify({"error": "No token provided"}), 401
        try:
            if not id_token.startswith('Bearer '):
                raise ValueError("Invalid token format")
            
            # Bearer トークンから実際のトークン部分を取り出す
            id_token = id_token.split("Bearer ")[1]
            # トークンを検証し、デコードされたトークンを取得
            decoded_token = auth.verify_id_token(id_token)
            # UIDを取得し、リクエストオブジェクトに添付
            request.uid = decoded_token['uid']
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({"error": str(e)}), 401
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except auth.ExpiredIdTokenError:
            return jsonify({"error": "Expired token"}), 401
        except Exception as e:
            return jsonify({"error": "Failed to authenticate token"}), 401
    return decorated_function