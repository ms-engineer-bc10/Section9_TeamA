import os
import requests
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

def get_prefecture_from_latlng(latlng):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        'latlng': latlng,
        'key': GOOGLE_API_KEY
    }
    
    try:
        response = requests.get(url, params=params)
        print(f"Google Geocoding API Response Status: {response.status_code}")
    except Exception as e:
        print(f"Error in Geocoding API request: {e}")
        return None

    if response.status_code == 200:
        result = response.json()
        if result['status'] == 'OK' and result['results']:
            for component in result['results'][0]['address_components']:
                if 'administrative_area_level_1' in component['types']:
                    return component['long_name']
        return None
    else:
        print(f"Geocoding API Error: {response.status_code}, {response.text}")
        return None

def get_latlng_from_prefecture(prefecture_name):
    print(f"デバッグ1: 受け取った都道府県名 = {prefecture_name}")  # 追加

    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": f"{prefecture_name}, Japan",  # 追加　"Japan"を追加して精度を向上
        # "address": prefecture_name,
        "key": GOOGLE_API_KEY,
        "language": "ja"  # 追加　日本語での結果を要求 
    }
    
    print(f"デバッグ2: リクエストパラメータ = {params}")  # 追加

    try:
        response = requests.get(url, params=params)
        print(f"Google Geocoding API Response Status: {response.status_code}")
        print(f"デバッグ3: レスポンス全体 = {response.json()}")  # 追加
    except Exception as e:
        print(f"Error in Google Geocoding API request: {e}")
        return None

    if response.status_code == 200:
        result = response.json()
        print(f"デバッグ4: レスポンスのステータス = {result['status']}")  # 追加
        if result['status'] == 'OK' and result['results']:
            location = result['results'][0]["geometry"]["location"]
            print(f"デバッグ5: 取得した位置情報 = {location}")  # 追加
            latlng = f"{location['lat']},{location['lng']}"
            print(f"デバッグ6: 生成した緯度経度文字列 = {latlng}")  # 追加
            return latlng
        print("デバッグ7: 有効な結果が見つかりませんでした")  # 追加
        return None
    else:
        print(f"Geocoding API Error: {response.status_code}, {response.text}")
        return None