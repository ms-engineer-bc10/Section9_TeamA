from app.models import db, Product
from sqlalchemy.exc import SQLAlchemyError

def save_selected_product(selected_product):
    try:
        new_product = Product(
            id=selected_product['id'],
            name=selected_product['name'],
            price=selected_product['price'],
            picture=selected_product['image_url']  # filtered_productsの影響で、一旦商品画像URLとして保存するよう設定　
                                                # ユーザーに表示する際には<img src={product.picture} alt={product.name} />のように設定する必要がある
        )
        db.session.add(new_product)
        db.session.commit()
        return new_product, 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return {'error': str(e)}, 500
