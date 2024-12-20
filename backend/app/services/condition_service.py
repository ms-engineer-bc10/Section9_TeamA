from app.models import db, Condition
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from app.utils.budget_utils import parse_budget
from app.services.google_geocoding_service import get_prefecture_from_latlng, get_latlng_from_prefecture

def save_condition(data):
    try:
        # 予算を解析
        budget = data.get('budget')
        budget_from, budget_to = parse_budget(budget)

        # location_typeに基づいて処理を分ける
        location = data.get('location')
        location_type = data.get('location_type')
        if location_type == 'current':
            # 緯度経度情報が提供されている場合
            latitude, longitude = map(float, location.split(','))
            prefecture_name = get_prefecture_from_latlng(location)  # 緯度経度から都道府県名を取得
        elif location_type == 'prefecture':
            # 都道府県名が提供されている場合
            prefecture_name = location

            latlng = get_latlng_from_prefecture(prefecture_name)  # 都道府県名から緯度経度を取得
            if latlng:
                try:
                    latitude, longitude = map(float, latlng.split(','))
                except Exception as e:
                    return {'error': 'Invalid coordinates format'}, 400
        else:
            return {'error': 'Invalid location_type'}, 400

        # DB保存 (uidを使用)
        new_condition = Condition(
            user_id=data['uid'],  # リクエストから送られてきたuidを使用
            target=data['target'],
            genre=data['genre'],
            budget_min=budget_from,
            budget_max=budget_to,
            quantity=data['quantity'],
            latitude=latitude,
            longitude=longitude,
            prefecture_name=prefecture_name,
            searched_at=datetime.now()
        )
        db.session.add(new_condition)
        db.session.commit()

        # condition_id を含めてレスポンスを返す
        return {"message": "Condition created successfully", "condition_id": new_condition.id}, 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return {'error': str(e)}, 500


# GETメソッドで特定のcondition_idに基づいて保存したConditionデータを取得
def get_condition_by_id(condition_id):
    try:
        condition = Condition.query.get(condition_id)
        if condition:
            return {
                "id": condition.id,
                "user_id": condition.user_id,
                "target": condition.target,
                "genre": condition.genre,
                "budget_min": condition.budget_min,
                "budget_max": condition.budget_max,
                "quantity": condition.quantity,
                "latitude": condition.latitude,
                "longitude": condition.longitude,
                "prefecture_name": condition.prefecture_name,
                "searched_at": condition.searched_at
            }, 200
        return {"error": "Condition not found"}, 404

    except SQLAlchemyError as e:
        return {"error": str(e)}, 500


# GETメソッドで特定のuser_idに基づいてすべてのConditionデータを取得
def get_conditions_by_user_id(user_id):
    try:
        conditions = Condition.query.filter_by(user_id=user_id).all()
        if conditions:
            return [{
                "id": condition.id,
                "target": condition.target,
                "genre": condition.genre,
                "budget_min": condition.budget_min,
                "budget_max": condition.budget_max,
                "quantity": condition.quantity,
                "latitude": condition.latitude,
                "longitude": condition.longitude,
                "prefecture_name": condition.prefecture_name,
                "searched_at": condition.searched_at
            } for condition in conditions], 200
        return {"error": "No conditions found for the user"}, 404

    except SQLAlchemyError as e:
        return {"error": str(e)}, 500