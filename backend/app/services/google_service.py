import os
import requests
from app.services.openai_service import get_openai_recommendation

def search_google_places(location, recommendations_data, previous_product_id=None, radius=2000):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise ValueError("Google Places API key is not set")

    ai_recommendation, selected_product = get_openai_recommendation(recommendations_data, previous_product_id)
    
    if not selected_product:
        print("No product was selected by OpenAI.")
        return []
    
    selected_product_name = selected_product.get('name', '不明')

    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    query = f"白い恋人 near {location}"

    params = {
        "query": query,
        "radius": radius,
        "type": "store",
        "key": api_key
    }

    try:
        response = requests.get(base_url, params=params)
        print(f"Google Places API response: {response}", flush=True)
        print(f"Google Places API Response Status: {response.status_code}")
    except Exception as e:
        print(f"Error in Google Places API request: {e}")
        return []

    if response.status_code != 200:
        raise Exception(f"Google Places API request failed with status code {response.status_code}")

    data = response.json()

    if "results" not in data:
        return []

    places = []
    for place in data["results"]:
        places.append({
            "name": place.get("name"),
            "address": place.get("formatted_address"),
            "rating": place.get("rating"),
            "user_ratings_total": place.get("user_ratings_total"),
            "place_id": place.get("place_id"),
            "location": place.get("geometry", {}).get("location", {})
        })
        print(f"店舗情報: {places}", flush=True)

    return places
