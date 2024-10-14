from flask import Blueprint, request, jsonify
from app.models import db, Like
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

like_routes = Blueprint('like_routes', __name__)

# POSTエンドポイント：新規いいねを作成
@like_routes.route('/likes', methods=['POST'])
def create_like():
    try:
        data = request.get_json()
        new_like = Like(
            user_id=data['user_id'],
            recommendation_id=data['recommendation_id'],
            created_at=datetime.now(),
            updated_at=datetime.now(),
            deleted_at=None
        )
        db.session.add(new_like)
        db.session.commit()
        return jsonify({"message": "Like created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# GETエンドポイント：特定のユーザーのいいねを取得
@like_routes.route('/likes/user/<user_id>', methods=['GET'])
def get_user_likes(user_id):
    likes = Like.query.filter_by(user_id=user_id, deleted_at=None).all()  # 取り消されていない「いいね」を取得
    return jsonify([{
        "id": like.id,
        "recommendation_id": like.recommendation_id,
        "created_at": like.created_at,
        "updated_at": like.updated_at
    } for like in likes]), 200

# DELETEエンドポイント：特定のいいねを取り消す（論理削除）
@like_routes.route('/likes/<int:id>', methods=['DELETE'])
def unlike(id):
    try:
        like = Like.query.get(id)
        if not like:
            return jsonify({"error": "Like not found"}), 404

        like.deleted_at = datetime.now()
        db.session.commit()
        return jsonify({"message": "Like removed successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# PUTエンドポイント：取り消したいいねを再度有効化する
@like_routes.route('/likes/<int:id>/restore', methods=['PUT'])
def restore_like(id):
    try:
        like = Like.query.get(id)
        if not like:
            return jsonify({"error": "Like not found"}), 404

        if not like.deleted_at:
            return jsonify({"message": "Like is already active"}), 400

        like.deleted_at = None
        db.session.commit()
        return jsonify({"message": "Like restored successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
