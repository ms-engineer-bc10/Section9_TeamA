import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_recommendation(get_recommendations, previous_product_id=None):
    target = get_recommendations.get('target')
    genre = get_recommendations.get('genre')
    budget = get_recommendations.get('budget')
    quantity = get_recommendations.get('quantity')
    location = get_recommendations.get('location')
    shopping_results = get_recommendations.get('shopping_results', [])

    if not shopping_results:
        print("No shopping results found.")
        return None, None

    filtered_products = [item for item in shopping_results if item['id'] != previous_product_id]

    if not filtered_products:
        print("No products found after filtering.")
        return None, None

    products_list = [{
        '商品ID': item.get('id', '不明'),
        '商品名': item.get('name', '不明'),
        '価格': item.get('budget', '不明'),
        '説明': item.get('description', '説明なし')
    } for item in filtered_products]

    product_selection_response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": (
                    "あなたはおみやげ専門のアシスタントです。ユーザーの条件に最も合った商品を1つ選んでください。"
                    "ユーザーが求めている商品は、受取人の関係やカテゴリ、価格帯、数量が重要な要素です。"
                    "条件で指定されているlocationが旅先になる。旅先で購入するおみやげを選ぶよう考慮してください。"
                    "商品IDを基に、条件に最も適した商品を選び、その商品名とIDのみを返答してください。"
                    "リストの中から1つだけ選択し、その商品IDと理由を明示してください。"
                )
            },
            {
                "role": "user",
                "content": (
                    f"受取人: {target}（例: 家族、友人、同僚など）,"
                    f"カテゴリ: {genre}（例: 食品、雑貨など）, "
                    f"価格帯: {budget}（例: ¥2,000〜3,999）, "
                    f"入数: {quantity}（例: 2〜5個）, "
                    f"場所: {location}, 商品リスト: {products_list}"
                )
            }
        ],
        max_tokens=300
    )

    if product_selection_response and 'choices' in product_selection_response:
        selected_product_info = product_selection_response['choices'][0]['message']['content']
        selected_product_id = None
        for item in filtered_products:
            if f"商品ID: {item['id']}" in selected_product_info:
                selected_product_id = item['id']
                selected_product = item
                break

        if not selected_product_id:
            selected_product = filtered_products[0]

        product_comment_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "選んだお土産について、おみやげとしてのおすすめポイントを具体的に、50文字以内で説明してください。"
                },
                {
                    "role": "user",
                    "content": (
                        f"商品ID: {selected_product.get('id', '不明')}, "
                        f"商品名: {selected_product.get('name', '不明')}, "
                        f"価格: {selected_product.get('budget', '不明')}, "
                        f"説明: {selected_product.get('description', '説明なし')}"
                    )
                }
            ],
            max_tokens=100
        )

        if product_comment_response and 'choices' in product_comment_response:
            ai_recommend = product_comment_response['choices'][0]['message']['content']
            return ai_recommend, selected_product

    return None, None
