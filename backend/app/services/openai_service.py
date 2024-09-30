import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_recommendation(get_recommendations, shopping_results):
    recipient = get_recommendations.get('recipient', '不明')
    category = get_recommendations.get('category', '不明')
    price = get_recommendations.get('price', '不明')
    quantity = get_recommendations.get('quantity', '不明')
    location = get_recommendations.get('location', '不明')

    products_list = []
    for item in shopping_results.get('hits', []):
        products_list.append({
            '商品名': item.get('name', '不明'),
            '価格': item.get('price', '不明'),
            '説明': item.get('description', '説明なし'),
        })

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "以下の商品のリストから、ユーザーが選択した条件に最も合致する商品を1つ選び、特徴を100文字以内で教えてください。"
            },
            {
                "role": "user",
                "content": f"受取人: {recipient}, カテゴリ: {category}, 価格: {price}, 個数: {quantity}, 位置情報: {location}, 商品リスト: {products_list}"
            }
        ],
        max_tokens=200
    )
    
    if response and 'choices' in response:
        return response['choices'][0]['message']['content']
    return None
