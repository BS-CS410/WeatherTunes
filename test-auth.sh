#!/bin/bash

echo "Testing simplified Spotify authentication system..."

# Check if backend is running
if ! curl -s http://127.0.0.1:8000/auth/session > /dev/null; then
    echo "❌ Backend not running. Please start the backend first:"
    echo "   cd backend && python run.py"
    exit 1
fi

echo "✅ Backend is running"

# Test auth session endpoint
echo "Testing auth session endpoint..."
response=$(curl -s -w "%{http_code}" http://127.0.0.1:8000/auth/session)
http_code="${response: -3}"

if [ "$http_code" = "200" ]; then
    echo "✅ Auth session endpoint is working"
    echo "Response: ${response%???}"
else
    echo "❌ Auth session endpoint failed with status: $http_code"
fi

# Test auth login endpoint
echo "Testing auth login endpoint (should redirect)..."
login_response=$(curl -s -w "%{http_code}" -o /dev/null http://127.0.0.1:8000/auth/login)

if [ "$login_response" = "302" ]; then
    echo "✅ Auth login endpoint is working (redirecting to Spotify)"
else
    echo "❌ Auth login endpoint failed with status: $login_response"
fi

echo ""
echo "🚀 System tests completed!"
echo ""
echo "To test the full flow:"
echo "1. Start the frontend: npm run dev"
echo "2. Open http://127.0.0.1:5173 in your browser"
echo "3. Click 'Login with Spotify' to test the authentication flow"
