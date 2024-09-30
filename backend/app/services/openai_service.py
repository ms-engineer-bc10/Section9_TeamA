import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_recommendation(shopping_results, get_recommendations):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": f"次の条件に基づいて最適なおみやげを選んでください:\n{get_recommendations}\n\n商品リスト:\n{shopping_results}"}
        ],
        max_tokens=100
    )
    
    if response and 'choices' in response:
        return response['choices'][0]['message']['content']
    return None
