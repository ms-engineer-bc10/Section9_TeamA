import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_recommendation(get_recommendations, previous_product_id=None):
    target = get_recommendations.get('target')
    genre = get_recommendations.get('genre')
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
        '説明': item.get('description', '説明なし')
    } for item in filtered_products]

    # AIによる商品選定
    product_selection_response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": (
                    "あなたはおみやげ選びのアシスタントです。ユーザーの条件（受取人、カテゴリ、数量、場所）に基づき、最適なおみやげを1つ提案してください。"
                        "\n受取人によって以下の特徴を考慮してください:"
                        "\n- 家族：家庭で楽しめる共有できるもの"
                        "\n- 友人：話題性のある手軽なもの"
                        "\n- 恋人：特別感やおしゃれなパッケージ"
                        "\n- 職場：分けやすく万人受けするもの"
                        "\n- 自分：日常使いできる自分用アイテム"
                        "\nカテゴリ、数量によって以下の特徴を考慮してください:"
                        "\n- 食べ物で数量が複数の場合：個包装になっているもの"
                )
            },
            {
                "role": "user",
                "content": (
                    f"受取人: {target}"
                    f"カテゴリ: {genre}"
                    f"入数: {quantity} "
                    f"場所: {location}, 商品リスト: {products_list}"
                )
            }
        ],
        max_tokens=300
    )
        
    if product_selection_response and 'choices' in product_selection_response:
        selected_product_info = product_selection_response['choices'][0]['message']['content']
        selected_product = None

    for item in filtered_products:
        if f"商品ID: {item['id']}" in selected_product_info:
            selected_product_id = item['id']
            selected_product = item
            break

    # 商品が見つからない場合のデフォルト設定
    if not selected_product:
        selected_product = filtered_products[0]
        selected_product_id = selected_product['id']

        # 名前を短縮
        product_name_simplification_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "あなたは商品の名前を短くシンプルな単語にするアシスタントです。"
                },
                {
                    "role": "user",
                    "content": f"商品ID: {selected_product_id}, 商品名: {selected_product.get('name', '不明')}"
                }
            ],
            max_tokens=20
        )

        if not product_name_simplification_response or 'choices' not in product_name_simplification_response:
            print("Error: Name simplification response is invalid or missing 'choices'.")
            return None, None

        simplified_name = product_name_simplification_response['choices'][0]['message']['content'].strip()
        selected_product['name'] = simplified_name

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
                        f"説明: {selected_product.get('description', '説明なし')}"
                    )
                }
            ],
            max_tokens=100
        )

        if product_comment_response and 'choices' in product_comment_response:
            ai_recommend = product_comment_response['choices'][0]['message']['content']
            print(f"おすすめ商品: {selected_product}", flush=True)

            # AIの推薦理由と商品情報を返す
            return ai_recommend, selected_product

    return None, None
