import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_recommendation(get_recommendations, previous_product_id=None):
    recipient = get_recommendations.get('recipient')
    category = get_recommendations.get('category')
    price = get_recommendations.get('price')
    quantity = get_recommendations.get('quantity')
    location = get_recommendations.get('location')
    shopping_results = get_recommendations.get('shopping_results', {}).get('hits', [])

    # 以前の提案商品を除外した商品リストを作成
    filtered_products = [item for item in shopping_results if item['id'] != previous_product_id]

    products_list = [{
        '商品名': item.get('name', '不明'),
        '価格': item.get('price', '不明'),
        '説明': item.get('description', '説明なし')
    } for item in filtered_products]

    product_selection_response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "以下の商品のリストから、ユーザーが選択した条件に最も合致するおみやげにふさわしい商品を1つ選んでください。"
            },
            {
                "role": "user",
                "content": f"受取人: {recipient}, カテゴリ: {category}, 価格: {price}, 個数: {quantity}, 商品リスト: {products_list}"
            }
        ],
        max_tokens=200
    )
    
    if product_selection_response and 'choices' in product_selection_response:
        selected_product_name = product_selection_response['choices'][0]['message']['content']
        selected_product = None

        for item in filtered_products:
            if selected_product_name in item['name']:
                selected_product = item
                break

        if not selected_product:
            selected_product = filtered_products[0]

        # 選ばれた商品についてコメントを生成
        product_comment_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "選んだお土産について、おみやげとしてのおすすめポイントを100文字以内で説明してください。"
                },
                {
                    "role": "user",
                    "content": f"商品名: {selected_product.get('name', '不明')}, 価格: {selected_product.get('price', '不明')}, 説明: {selected_product.get('description', '説明なし')}"
                }
            ],
            max_tokens=100
        )

        if product_comment_response and 'choices' in product_comment_response:
            ai_recommend = product_comment_response['choices'][0]['message']['content']
            return ai_recommend, selected_product

    return None, None
