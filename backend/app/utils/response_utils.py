import logging
from flask import jsonify
from app.services.product_service import save_selected_product

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_recommendation_response(shopping_results, selected_product, ai_recommend, places_results, recommendation_id):
    formatted_shopping_results = []
    for item in shopping_results:  
        product = {
            '商品名': item.get('name', '不明'),
            '価格': item.get('price', '不明'),
            '個数': item.get('quantity', '不明'),
            '説明': item.get('description', '説明なし'),
            '画像URL': item.get('image_url', '画像なし'),
            '商品URL': item.get('url', 'URLなし')
        }
        formatted_shopping_results.append(product)

    if selected_product:
        save_selected_product(
            name=selected_product.get('name', '不明'),
            price=selected_product.get('price', 0),
            picture=selected_product.get('image_url', '画像なし'),
            ai_recommend=ai_recommend
        )

    if selected_product:
        ai_selected_product_name = selected_product.get('name', '不明')
    else:
        logger.warning("AIのおすすめ商品が見つかりませんでした。")
        ai_selected_product_name = "AIのおすすめ商品は見つかりませんでした"

    logger.info(f"AIのおすすめ商品: {ai_selected_product_name}")
    logger.info(f"AIのおすすめ理由: {ai_recommend}")

    return jsonify({
        'おすすめ商品ID': recommendation_id,
        'おすすめ商品一覧': formatted_shopping_results,
        'AIが選ぶおすすめ商品': ai_selected_product_name,
        'AIおすすめポイント': ai_recommend if ai_recommend else "AIのおすすめポイントがありません",
        '近隣店舗': places_results if places_results else "近隣の店舗情報が見つかりませんでした"
    })
