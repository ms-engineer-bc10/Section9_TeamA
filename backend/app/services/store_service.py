from app.models import db, Store
from sqlalchemy.exc import SQLAlchemyError

def save_store(store_data):
    try:
        # 1. まずは place_id が一致する店舗を検索
        existing_store = Store.query.filter_by(place_id=store_data['place_id']).first()

        # 2. place_id が一致する場合でも、name や address が異なる場合は情報を更新
        if existing_store:
            if existing_store.name != store_data['name'] or existing_store.address != store_data['address']:
                existing_store.name = store_data['name']
                existing_store.address = store_data['address']
                existing_store.latitude = store_data['location'].get('lat')
                existing_store.longitude = store_data['location'].get('lng')
                db.session.commit()
            return existing_store  # 更新された、または既存の店舗情報を返す

        # 3. 新規店舗として保存
        new_store = Store(
            name=store_data['name'],
            address=store_data['address'],
            latitude=store_data['location'].get('lat'),
            longitude=store_data['location'].get('lng'),
            place_id=store_data.get('place_id')  # place_id があれば設定
        )
        db.session.add(new_store)
        db.session.commit()

        return new_store

    except SQLAlchemyError as e:
        db.session.rollback()
        return {'error': str(e)}, 500
