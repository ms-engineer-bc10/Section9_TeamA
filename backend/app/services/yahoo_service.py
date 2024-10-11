import os
import requests
from dotenv import load_dotenv
from app.services.google_geocoding_service import get_prefecture_from_latlng

load_dotenv()
API_KEY = os.getenv("YAHOO_API_KEY")

def search_yahoo_shopping(location, budget_from=None, budget_to=None):
    # locationが緯度・経度の形式ならGeocoding APIで都道府県名に変換
    if ',' in location:
        prefecture = get_prefecture_from_latlng(location)
        if prefecture is None:
            print("Error converting latlng to prefecture.")
            return None
        location = prefecture
    else:
        location = location

    url = "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch"
    headers = {'Authorization': f'Bearer {API_KEY}'}
    query = f"おみやげ {location}"
    params = {
        'appid': 'API_KEY',
        'sort': '+price',
        'results': '20',
        'query': query
    }

    if budget_from is not None:
        params['budget_from'] = budget_from
    if budget_to is not None:
        params['budget_to'] = budget_to

    response = requests.get(url, headers=headers, params=params)

    print(f"Yahoo Shopping API Response Status: {response.status_code}")

    if response.status_code == 200:
        result = response.json()
        for idx, item in enumerate(result.get('hits', [])):
            item['id'] = idx
        return result
    else:
        print(f"Error in Yahoo API request: {response.status_code}, {response.text}")
    return None
