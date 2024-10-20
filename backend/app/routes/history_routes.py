from flask import Blueprint, jsonify
from app.models import db, Recommendation, Condition, Product
from sqlalchemy.exc import SQLAlchemyError

history_routes = Blueprint('history_routes', __name__)

@history_routes.route('/history', methods=['GET'])
def get_user_history():
    try:
        # 全てのRecommendationを取得
        recommendations = Recommendation.query.all()
        history_data = []

        # Recommendationを元に履歴データをフォーマット
        for recommendation in recommendations:
            condition = recommendation.condition
            product = recommendation.product

            # 条件や商品情報を元に履歴データを構築
            history_data.append({
                'id': recommendation.id,
                'date': recommendation.recommended_at.strftime("%Y-%m-%d"),
                'answers': {
                    'location': condition.prefecture_name if condition.prefecture_name else f"{condition.latitude}, {condition.longitude}",
                    'target': condition.target,
                    'genre': condition.genre,
                    'budget': f"{condition.budget_min}～{condition.budget_max}",
                    'quantity': condition.quantity,
                },
                'image': product.picture  # 商品の写真URL
            })

        return jsonify(history_data), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
