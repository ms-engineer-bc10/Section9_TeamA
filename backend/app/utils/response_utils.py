from flask import jsonify

def generate_recommendation_response(shopping_results, selected_product, product_comment_response, places_results):
    formatted_shopping_results = []
    for item in shopping_results.get('hits', []):
        product = {
            '商品名': item.get('name', '不明'),
            '価格': item.get('budget', '不明'),
            '個数': item.get('quantity', '不明'),
            '説明': item.get('description', '説明なし'),
            '画像URL': item.get('image', {}).get('medium', '画像なし'),
            '商品URL': item.get('url', 'URLなし')
        }
        formatted_shopping_results.append(product)

    return jsonify({
        'おすすめ商品一覧': formatted_shopping_results,
        'AIが選ぶおすすめ商品': selected_product['name'],
        'AIおすすめポイント': product_comment_response,
        '近隣店舗': places_results
    })
