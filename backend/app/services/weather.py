import requests
import os
import json
from pathlib import Path

USER_DATA_FILE = Path(__file__).parent.parent.parent / 'user_data.json'

def get_weather_by_ip(ip_address: str):
    try:
        print(f"[DEBUG] Fetching geolocation for IP: {ip_address}")
        geo_resp = requests.get(f"http://ip-api.com/json/{ip_address}")
        geo_data = geo_resp.json()
        print(f"[DEBUG] Geo response: {geo_data}")
        if geo_data['status'] != 'success':
            return None

        lat, lon = geo_data['lat'], geo_data['lon']
        api_key = os.getenv("OPENWEATHER_API_KEY")
        if not api_key:
            print("[ERROR] OPENWEATHER_API_KEY not set!")
            return None

        weather_url = (
            f"https://api.openweathermap.org/data/2.5/weather?"
            f"lat={lat}&lon={lon}&units=metric&appid={api_key}"
        )
        print(f"[DEBUG] Weather API URL: {weather_url}")
        weather_resp = requests.get(weather_url)
        weather_data = weather_resp.json()
        print(f"[DEBUG] Weather response: {weather_data}")

        return {
            "location": f"{geo_data['city']}, {geo_data['regionName']}",
            "temperature": weather_data['main']['temp'],
            "condition": weather_data['weather'][0]['main'],
            "time_period": "day" if weather_data['weather'][0]['icon'].endswith('d') else "night"
        }

    except Exception as e:
        print(f"[ERROR] Weather fetch failed: {e}")
        return None

    except Exception as e:
        print(f"Weather fetch failed: {e}")
        return None

def save_weather_data(username: str, weather: dict):
    try:
        with open(USER_DATA_FILE, 'r') as f:
            user_data = json.load(f)
    except FileNotFoundError:
        user_data = {}

    if username not in user_data:
        user_data[username] = {
            'created_at': None,
            'last_login': None,
            'last_weather': {},
            'favorites': []
        }

    user_data[username]['last_weather'] = weather

    with open(USER_DATA_FILE, 'w') as f:
        json.dump(user_data, f, indent=2)
