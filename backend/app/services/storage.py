import json
import os
from datetime import datetime

USER_DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "user_data.json")

def read_user_data():
    if not os.path.exists(USER_DATA_FILE):
        return {}
    with open(USER_DATA_FILE, "r") as f:
        return json.load(f)

def write_user_data(data):
    with open(USER_DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

def read_track_ids(user_id: str):
    data = read_user_data()
    user = data.get(user_id)
    if user and "favorites" in user:
        return user["favorites"]
    return []

def write_track_id(user_id: str, track_id: str):
    data = read_user_data()
    now_iso = datetime.utcnow().isoformat()
    
    user = data.get(user_id)
    if not user:
        user = {
            "created_at": now_iso,
            "last_login": now_iso,
            "last_weather": {},
            "favorites": []
        }
        data[user_id] = user
    else:
        user["last_login"] = now_iso
        if "favorites" not in user:
            user["favorites"] = []

    if track_id in user["favorites"]:
        return  # already exists, no duplication

    user["favorites"].append(track_id)
    write_user_data(data)
