from flask import Blueprint, request, jsonify
from app.models import db, Like
from sqlalchemy.exc import SQLAlchemyError
import logging
logging.basicConfig(level=logging.INFO)

like_routes = Blueprint('like_routes', __name__)

@like_routes.route('/', methods=['POST'])
def add_like():
    data = request.json
    user_id = data.get('user_id')
    recommendation_id = data.get('recommendation_id')

    try:
        like = Like(user_id=user_id, recommendation_id=recommendation_id)
        db.session.add(like)
        db.session.commit()
        return jsonify({"message": "Like added successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"Database error: {str(e)}")  # エラーメッセージのログ出力
        return jsonify({"error": str(e)}), 500
