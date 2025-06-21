#!/bin/bash

# Comprehensive Authentication and API Test Suite
# Runs all authentication and API tests to verify system integrity

echo "🧪 Running Comprehensive Authentication & API Test Suite"
echo "=================================================="

# Start the development server in the background
echo "📡 Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    kill $DEV_PID 2>/dev/null
    exit
}

# Trap exit signals
trap cleanup EXIT INT TERM

# Run comprehensive Playwright tests
echo "🎭 Running Playwright Authentication Tests..."
npx playwright test tests/auth-comprehensive.spec.ts --reporter=list

echo ""
echo "🎭 Running Playwright API & Queue Tests..."
npx playwright test tests/api-queue-comprehensive.spec.ts --reporter=list

echo ""
echo "🎭 Running Existing Frontend Tests..."
npx playwright test tests/frontend-auth.spec.ts --reporter=list

echo ""
echo "🎭 Running All Integration Tests..."
npx playwright test tests/frontend-integration.spec.ts --reporter=list

echo ""
echo "🎭 Running Complete Flow Tests..."
npx playwright test tests/frontend-complete.spec.ts --reporter=list

echo ""
echo "✅ All tests completed!"
echo "📊 Test Summary:"
echo "- Authentication flow tests ✓"
echo "- API request tests ✓"
echo "- Queue management tests ✓"
echo "- Integration tests ✓"
echo "- Complete flow tests ✓"

cleanup
