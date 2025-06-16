import os
from dotenv import load_dotenv

# Load env vars from root directory (default .env file)
load_dotenv()

from flask import Flask
from flask_cors import CORS
from app.routes.recommended import recommended_bp
from app.routes.liked_songs import liked_songs_bp
from app.routes.user import user_bp
from app.routes.auth import auth_bp  # import auth blueprint

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'supersecretkey')

# ✅ SESSION SETTINGS FOR DEV (localhost:5173 + 127.0.0.1:8000)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'   # allow cross-origin with top-level nav
app.config['SESSION_COOKIE_SECURE'] = False     # only True if you're using HTTPS
app.config['SESSION_COOKIE_DOMAIN'] = None      # Don't restrict domain
app.config['SESSION_COOKIE_HTTPONLY'] = False   # Allow JavaScript access for debugging

# ✅ Enable CORS with credentials support
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])

# Register blueprints
app.register_blueprint(recommended_bp)
app.register_blueprint(liked_songs_bp)
app.register_blueprint(user_bp)
app.register_blueprint(auth_bp)

# Print registered routes
for rule in app.url_map.iter_rules():
    print(f"{rule} -> {rule.endpoint}")

@app.route('/')
def home():
    return "Backend is up and running!"

if __name__ == "__main__":
    app.run(port=8000, debug=True)
