import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_recommendation(get_recommendations, previous_product_id=None):
    recipient = get_recommendations.get('recipient', '不明')
    category = get_recommendations.get('category', '不明')
    price = get_recommendations.get('price', '不明')
    quantity = get_recommendations.get('quantity', '不明')
    location = get_recommendations.get('location', '不明')
    shopping_results = get_recommendations.get('shopping_results', {}).get('hits', [])

    # 以前の提案商品を除外した商品リストを作成
    filtered_products = [item for item in shopping_results if item['id'] != previous_product_id]

    products_list = [{
        '商品名': item.get('name', '不明'),
        '価格': item.get('price', '不明'),
        '説明': item.get('description', '説明なし')
    } for item in filtered_products]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "以下の商品のリストから、ユーザーが選択した条件に最も合致する商品を1つ選び、100文字以内でそのお土産のおすすめポイントを説明してください。"
            },
            {
                "role": "user",
                "content": f"受取人: {recipient}, カテゴリ: {category}, 価格: {price}, 個数: {quantity}, 商品リスト: {products_list}"
            }
        ],
        max_tokens=200
    )
    
    if response and 'choices' in response:
        ai_recommend = response['choices'][0]['message']['content']
        selected_product = None

        for item in filtered_products:
            if item['name'] in ai_recommend:
                selected_product = item
                break

        if not selected_product:
            selected_product = filtered_products[0]

        return ai_recommend, selected_product

    return None, None
