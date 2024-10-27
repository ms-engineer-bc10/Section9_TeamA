from flask import Blueprint, request, jsonify
from app.models import db, Like, Recommendation, Product
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
        logging.error(f"Database error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

@like_routes.route('/<user_id>', methods=['GET'])
def get_likes(user_id):
    try:
        # user_idに紐づくLikeとそのRecommendation, Product情報を取得
        likes = db.session.query(Like, Recommendation, Product).join(
            Recommendation, Like.recommendation_id == Recommendation.id
        ).join(
            Product, Recommendation.product_id == Product.id
        ).filter(
            Like.user_id == user_id,
            Like.deleted_at == None
        ).all()

        liked_data = [
            {
                "id": like.Like.id,
                "imageUrl": like.Product.picture,
                "likedAt": like.Like.created_at,
            }
            for like in likes
        ]

        return jsonify(liked_data), 200
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({"error": "Failed to fetch likes"}), 500
