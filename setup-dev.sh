#!/bin/bash

# WeatherTunes Development Setup Script

echo "🌪️🎸 WeatherTunes Development Setup"
echo "===================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

echo "✅ Python 3 found"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js and try again."
    exit 1
fi

echo "✅ Node.js found"

# Frontend setup
echo ""
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Backend setup
echo ""
echo "🐍 Setting up Python backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create a .env file with your API keys."
echo "   - For OpenWeatherMap: VITE_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here"
echo "   - For Spotify (if integrating):"
echo "     - Get credentials from: https://developer.spotify.com/dashboard"
echo "     - Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env"
echo "     - Set redirect URI in your Spotify app settings to: http://localhost:8000/callback (or as configured in your backend)"
echo "   (See backend/README.md for more details on .env setup)"
echo "2. Start the backend: cd backend && source venv/bin/activate && python run.py"
echo "3. In another terminal, start the frontend: npm run dev"
echo ""
echo "🎉 Happy coding!"
