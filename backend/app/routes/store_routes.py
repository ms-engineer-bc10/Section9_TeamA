from flask import Blueprint, request, jsonify
from app.models import db, Store
from sqlalchemy.exc import SQLAlchemyError

store_routes = Blueprint('store_routes', __name__)

# POSTエンドポイント：店舗データをデータベースに保存
@store_routes.route('/stores', methods=['POST'])
def create_store():
    try:
        data = request.get_json()
        new_store = Store(
            name=data['name'],
            address=data['address'],
            tel=data['tel'],
            open_time=data['open_time'],
            latitude=data['latitude'],
            longitude=data['longitude']
        )
        db.session.add(new_store)
        db.session.commit()
        return jsonify({"message": "Store created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# GETエンドポイント：特定の店舗データを取得
@store_routes.route('/stores/<int:id>', methods=['GET'])
def get_store(id):
    store = Store.query.get(id)
    if store:
        return jsonify({
            "id": store.id,
            "name": store.name,
            "address": store.address,
            "tel": store.tel,
            "open_time": store.open_time,
            "latitude": store.latitude,
            "longitude": store.longitude
        }), 200
    return jsonify({"error": "Store not found"}), 404

# GETエンドポイント：すべての店舗データを取得
@store_routes.route('/stores', methods=['GET'])
def get_all_stores():
    stores = Store.query.all()
    return jsonify([{
        "id": store.id,
        "name": store.name,
        "address": store.address,
        "tel": store.tel,
        "open_time": store.open_time,
        "latitude": store.latitude,
        "longitude": store.longitude
    } for store in stores]), 200

# PUTエンドポイント：特定の店舗データを更新
@store_routes.route('/stores/<int:id>', methods=['PUT'])
def update_store(id):
    store = Store.query.get(id)
    if not store:
        return jsonify({"error": "Store not found"}), 404
    
    try:
        data = request.get_json()
        store.name = data.get('name', store.name)
        store.address = data.get('address', store.address)
        store.tel = data.get('tel', store.tel)
        store.open_time = data.get('open_time', store.open_time)
        store.latitude = data.get('latitude', store.latitude)
        store.longitude = data.get('longitude', store.longitude)
        
        db.session.commit()
        return jsonify({"message": "Store updated successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# DELETEエンドポイント：特定の店舗データを削除
@store_routes.route('/stores/<int:id>', methods=['DELETE'])
def delete_store(id):
    store = Store.query.get(id)
    if not store:
        return jsonify({"error": "Store not found"}), 404
    
    try:
        db.session.delete(store)
        db.session.commit()
        return jsonify({"message": "Store deleted successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
