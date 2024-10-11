import os
import requests

def search_google_places(location, radius=1000):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise ValueError("Google Places API key is not set")

    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": location,
        "radius": radius,
        "type": "store",
        "key": api_key
    }

    try:
        response = requests.get(base_url, params=params)
        print(f"Google Places API Response Status: {response.status_code}")
    except Exception as e:
        print(f"Error in Google Places API request: {e}")
        return []

    if response.status_code != 200:
        raise Exception(f"Google Places API request failed with status code {response.status_code}")

    data = response.json()
    print(f"Google Places API response data: {data}")

    if "results" not in data:
        return []

    places = []
    for place in data["results"]:
        places.append({
            "name": place.get("name"),
            "address": place.get("vicinity"),
            "rating": place.get("rating"),
            "user_ratings_total": place.get("user_ratings_total"),
            "place_id": place.get("place_id"),
            "location": place.get("geometry", {}).get("location", {})
        })

    return places
