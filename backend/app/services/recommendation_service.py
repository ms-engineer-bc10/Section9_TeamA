from app.models import db, Recommendation

def save_recommendation(condition_id, product_id, store_id):
    try:
        # Recommendationテーブルに条件、商品、店舗のIDを保存
        new_recommendation = Recommendation(
            condition_id=condition_id,
            product_id=product_id,
            store_id=store_id
        )
        db.session.add(new_recommendation)
        db.session.commit()
        return new_recommendation
    except SQLAlchemyError as e:
        db.session.rollback()
        return {'error': str(e)}, 500
