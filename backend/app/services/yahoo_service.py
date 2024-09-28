import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("YAHOO_API_KEY")

def search_yahoo_shopping(keyword):
    url = "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch"
    headers = {'Authorization': f'Bearer {API_KEY}'}
    params = {'query': keyword}
    
    response = requests.get(url, headers=headers, params=params)
    return response.json() if response.status_code == 200 else None
