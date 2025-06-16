from flask import Blueprint, redirect, request, session, jsonify
from spotipy.oauth2 import SpotifyOAuth
from flask_cors import cross_origin
import os
import spotipy
from app.services.user_data import update_user_login

auth_bp = Blueprint('auth', __name__)

sp_oauth = SpotifyOAuth(
    client_id=os.getenv('SPOTIPY_CLIENT_ID'),
    client_secret=os.getenv('SPOTIPY_CLIENT_SECRET'),
    redirect_uri=os.getenv('SPOTIPY_REDIRECT_URI'),
    scope='user-library-read user-read-email user-read-private',
    cache_path='.cache'  # optional
)

@auth_bp.route('/login')
@cross_origin(supports_credentials=True)
def login():
    auth_url = sp_oauth.get_authorize_url()
    print("Spotify auth URL:", auth_url)  # DEBUG
    return redirect(auth_url)


@auth_bp.route('/callback')
@cross_origin(supports_credentials=True)
def callback():
    code = request.args.get('code')
    error = request.args.get('error')

    if error:
        return jsonify({'error': error}), 400

    token_info = sp_oauth.get_access_token(code)
    if not token_info:
        return jsonify({'error': 'Failed to get token'}), 400

    sp = spotipy.Spotify(auth=token_info['access_token'])
    profile = sp.current_user()
    spotify_username = profile.get('id')
    if not spotify_username:
        return jsonify({'error': 'Failed to get Spotify user ID'}), 400

    # Save tokens and username in session
    session['access_token'] = token_info['access_token']
    session['refresh_token'] = token_info.get('refresh_token')
    session['expires_at'] = token_info.get('expires_at')
    session['spotify_username'] = spotify_username
    
    print(f"[DEBUG] Saved session data for user: {spotify_username}")
    print(f"[DEBUG] Session contents after save: {dict(session)}")

    # Update user login metadata
    update_user_login(spotify_username)

    return redirect("http://127.0.0.1:5173/auth-callback")

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect("http://127.0.0.1:5173")

@auth_bp.route('/session')
def session_info():
    print(f"[DEBUG] Session info request - Session contents: {dict(session)}")
    logged_in = 'access_token' in session and 'spotify_username' in session
    username = session.get('spotify_username') if logged_in else None
    print(f"[DEBUG] Logged in: {logged_in}, Username: {username}")
    return jsonify({'logged_in': logged_in, 'spotify_username': username})

@auth_bp.route('/userinfo')
@cross_origin(supports_credentials=True)
def userinfo():
    if 'spotify_username' in session:
        return jsonify({'spotify_username': session['spotify_username']})
    else:
        return jsonify({'error': 'Not logged in'}), 401