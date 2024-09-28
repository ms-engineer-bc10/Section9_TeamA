import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_openai_recommendation(query):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": query}
        ],
        max_tokens=100
    )
    
    if response and 'choices' in response:
        return response.choices[0].message['content'].strip()
    return None
