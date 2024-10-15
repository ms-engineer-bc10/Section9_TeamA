from firebase_admin import auth
from flask import request, jsonify
from functools import wraps

def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            id_token = auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else None

        if not id_token:
            return jsonify({"error": "No token provided"}), 401

        try:
            decoded_token = auth.verify_id_token(id_token)
            request.uid = decoded_token['uid']
        except Exception as e:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated_function