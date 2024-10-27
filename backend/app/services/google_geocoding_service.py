import os
import requests
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

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
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": prefecture_name,
        "key": GOOGLE_API_KEY
    }

    try:
        response = requests.get(url, params=params)
        print(f"Google Geocoding API Response Status: {response.status_code}")
    except Exception as e:
        print(f"Error in Google Geocoding API request: {e}")
        return None

    if response.status_code == 200:
        result = response.json()
        if result['status'] == 'OK' and result['results']:
            location = result['results'][0]["geometry"]["location"]
            latlng = f"{location['lat']},{location['lng']}"
            return latlng
        return None
    else:
        print(f"Geocoding API Error: {response.status_code}, {response.text}")
        return None
