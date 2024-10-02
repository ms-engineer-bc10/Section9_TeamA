import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_recommendation(get_recommendations):
    recipient = get_recommendations.get('recipient', '不明')
    category = get_recommendations.get('category', '不明')
    price = get_recommendations.get('price', '不明')
    quantity = get_recommendations.get('quantity', '不明')
    location = get_recommendations.get('location', '不明')

    selected_product = get_recommendations.get('selected_product', {})
    product_name = selected_product.get('name', '不明')
    product_price = selected_product.get('price', '不明')
    product_description = selected_product.get('description', '説明なし')

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "以下の商品の詳細に基づき、ユーザーに最適なおすすめポイントを100文字以内で説明してください。"
            },
            {
                "role": "user",
                "content": f"商品名: {product_name}, 価格: {product_price}, 説明: {product_description}"
            }
        ],
        max_tokens=200
    )
    
    if response and 'choices' in response:
        return response['choices'][0]['message']['content']
    return None
