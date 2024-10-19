from app.models import db, Product
from sqlalchemy.exc import SQLAlchemyError

def save_selected_product(name, price, picture, ai_recommend):
    try:
        new_product = Product(
            name=name, 
            price=price, 
            picture=picture, 
            comment=ai_recommend)
        # filtered_productsの影響で、一旦商品画像URLとして保存するよう設定　
        # ユーザーに表示する際には<img src={product.picture} alt={product.name} />のように設定する必要がある
        db.session.add(new_product)
        db.session.commit()
        return new_product.id, 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return {'error': str(e)}, 500
