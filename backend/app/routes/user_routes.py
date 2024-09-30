from flask import Blueprint, request, jsonify
from app.services.openai_service import get_openai_recommendation
from app.services.yahoo_service import search_yahoo_shopping
from app.services.google_service import search_google_places

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.json
    recipient = data.get('recipient')
    price = data.get('price')
    quantity = data.get('quantity')
    location = data.get('location')
    price_from, price_to = parse_price(price)
    shopping_results = search_yahoo_shopping(price_from, price_to)

    ai_input_data = {
        'recipient': recipient,
        'category': data.get('category'),
        'price': price,
        'quantity': quantity,
        'location': location
    }

    ai_recommend = get_openai_recommendation(ai_input_data, shopping_results)

    places_results = search_google_places(location, radius=1000)

    return jsonify({
        'おすすめ商品一覧': shopping_results,
        'AIが選ぶおすすめ': ai_recommend,
        '近隣店舗': places_results,
    })

def parse_price(price_str):
    # 「¥」「,」を削除
    price_str = price_str.replace('¥', '').replace(',', '').strip()

    if '〜' in price_str:  # 範囲指定の場合
        price_range = price_str.split('〜')
        price_from = int(price_range[0]) if price_range else 0
        price_to = int(price_range[1]) if len(price_range) > 1 else 999999
    else:  # "¥10,000〜"の場合
        if price_str.endswith('〜'):
            price_from = int(price_str[:-1])  # 最後の「〜」を削除
            price_to = 999999  # デフォルトで上限を設定
        else:
            price_from = int(price_str)
            price_to = int(price_str)

    return price_from, price_to