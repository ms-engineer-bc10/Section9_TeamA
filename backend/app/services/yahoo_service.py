import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("YAHOO_API_KEY")

def search_yahoo_shopping(price_from=None, price_to=None):
    url = "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch"
    headers = {'Authorization': f'Bearer {API_KEY}'}
    params = {
        'appid': 'API_KEY',
        'sort': '+price',
        'results': '10',
        # "location"で入力された場所情報をqueryに含める必要あり
        'query': 'おみやげ 大阪'
    }

    if price_from is not None:
        params['price_from'] = price_from
    if price_to is not None:
        params['price_to'] = price_to

    response = requests.get(url, headers=headers, params=params)
    return response.json() if response.status_code == 200 else None
