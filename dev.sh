#!/bin/zsh
# Simple development script for frontend-only WeatherTunes

echo "🌪️🎸 Starting WeatherTunes development server..."

# Kill any existing dev server
if lsof -i :5173 | grep LISTEN; then
  echo "🛑 Stopping existing dev server..."
  lsof -ti :5173 | xargs kill -9
fi

# Note: No backend server needed! Using Spotify Authorization Code + PKCE flow
echo "✨ Using frontend-only authentication (no backend required)"

# Start the development server
echo "🚀 Starting Vite dev server..."
npm run dev
