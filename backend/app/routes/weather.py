from flask import Blueprint, request, session, jsonify
from app.services.weather import save_weather_data

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weather', methods=['POST'])
def post_weather():
    if 'spotify_username' not in session:
        return jsonify({'error': 'User not logged in'}), 401

    username = session['spotify_username']
    data = request.get_json()

    weather = {
        'location': data.get('location'),
        'temperature': data.get('temperature'),
        'condition': data.get('condition'),
        'time_period': data.get('time_period'),
    }

    if not all(weather.values()):
        return jsonify({'error': 'Incomplete weather data'}), 400

    save_weather_data(username, weather)
    return jsonify({'message': f'Weather data saved for {username}'}), 200
