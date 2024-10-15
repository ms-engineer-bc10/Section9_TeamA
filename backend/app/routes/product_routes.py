from flask import Blueprint, request, jsonify
from app.models import db, Product
from sqlalchemy.exc import SQLAlchemyError

product_routes = Blueprint('product_routes', __name__)

# POSTエンドポイント：商品データをデータベースに保存
@product_routes.route('', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        new_product = Product(
            name=data['name'],
            price=data['price'],
            picture=data.get('picture', None),
            comment=data.get('comment', None)
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"message": "Product created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# GETエンドポイント：特定の商品データを取得
@product_routes.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get(id)
    if product:
        return jsonify({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "picture": product.picture,
            "comment": product.comment
        }), 200
    return jsonify({"error": "Product not found"}), 404

# PUTエンドポイント：特定の商品データを更新
@product_routes.route('/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    try:
        data = request.get_json()
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.picture = data.get('picture', product.picture)
        product.comment = data.get('comment', product.comment)
        
        db.session.commit()
        return jsonify({"message": "Product updated successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# DELETEエンドポイント：特定の商品データを削除
@product_routes.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
