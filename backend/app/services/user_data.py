import json
from datetime import datetime
from flask import request
from app.services.weather import get_weather_by_ip, save_weather_data

USER_DATA_FILE = 'user_data.json'  # adjust path if needed

def read_user_data():
    try:
        with open(USER_DATA_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def write_user_data(data):
    with open(USER_DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def get_user_info(username):
    data = read_user_data()
    return data.get(username)

def update_user_login(username):
    data = read_user_data()
    now_iso = datetime.utcnow().isoformat()
    if username not in data:
        data[username] = {
            "created_at": now_iso,
            "last_login": now_iso,
            "last_weather": {},
            "favorites": []
        }
    else:
        data[username]["last_login"] = now_iso

    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if ip:
        ip = ip.split(',')[0].strip()  # Take the first IP if there are multiple
    if ip == '127.0.0.1':
        ip = '8.8.8.8'  # fallback for local testing
    print(f"[DEBUG] IP address: {ip}")

    weather = get_weather_by_ip(ip)
    print(f"[DEBUG] Weather returned: {weather}")

    if weather:
        data[username]["last_weather"] = weather
    else:
        print("[WARNING] Weather data was not fetched or was incomplete.")

    write_user_data(data)

    # Fetch and store weather
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    weather = get_weather_by_ip(ip)
    if weather:
        data[username]["last_weather"] = weather

    write_user_data(data)

def add_favorite(username, track_id):
    data = read_user_data()
    if username not in data:
        update_user_login(username)  # creates user if missing
        data = read_user_data()
    if track_id not in data[username].get("favorites", []):
        data[username]["favorites"].append(track_id)
        write_user_data(data)

def get_favorites(username):
    data = read_user_data()
    return data.get(username, {}).get("favorites", [])
