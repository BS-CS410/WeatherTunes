#!/bin/bash

echo "🔍 Testing Authentication Flow"
echo "================================"

echo -e "\n1️⃣ Testing session endpoint..."
curl -v -X GET "http://127.0.0.1:8000/auth/session" \
  -H "Content-Type: application/json" \
  -c cookies.txt 2>&1 | grep -E "(HTTP/|authenticated|username)"

echo -e "\n2️⃣ Testing queue endpoint (should fail with 401)..."
curl -X GET "http://127.0.0.1:8000/queue" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -w "Status: %{http_code}\n" 2>/dev/null

echo -e "\n3️⃣ Session cookies:"
if [ -f cookies.txt ]; then
  cat cookies.txt | grep -v "^#"
else
  echo "No cookies found"
fi

echo -e "\n📝 To test full auth flow:"
echo "1. Open: http://127.0.0.1:5175/"
echo "2. Look for AuthStatus component on the page"
echo "3. Click Login button"
echo "4. Complete Spotify OAuth"
echo "5. Check if 401 errors are resolved"
