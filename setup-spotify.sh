#!/bin/bash

# WeatherTunes Development Setup Script
echo "🌪️🎸 Setting up WeatherTunes with Spotify Integration..."

# Check if Python virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv backend/venv
fi

# Activate virtual environment and install dependencies
echo "🔧 Installing Python dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   1. Backend:  cd backend && source venv/bin/activate && python run.py"
echo "   2. Frontend: npm run dev"
echo ""
echo "📝 Don't forget to update your Spotify credentials in .env file:"
echo "   - Get them from: https://developer.spotify.com/dashboard"
echo "   - Set redirect URI to: http://localhost:8000/callback"
