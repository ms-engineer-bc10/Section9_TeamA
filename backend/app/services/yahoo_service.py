import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("YAHOO_API_KEY")

def search_yahoo_shopping(budget_from=None, budget_to=None):
    url = "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch"
    headers = {'Authorization': f'Bearer {API_KEY}'}
    params = {
        'appid': 'API_KEY',
        'sort': '+budget',
        'results': '30',
        # "location"で入力された場所情報をqueryに含める必要あり
        'query': 'おみやげ 大阪'
    }

    if budget_from is not None:
        params['budget_from'] = budget_from
    if budget_to is not None:
        params['budget_to'] = budget_to

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        result = response.json()
        for idx, item in enumerate(result.get('hits', [])):
            item['id'] = idx
        return result
    return None
