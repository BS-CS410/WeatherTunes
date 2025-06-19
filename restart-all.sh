#!/bin/zsh
# Kill any process on frontend (5173) and backend (8000) ports, then start both

# Kill frontend (Vite, port 5173)
if lsof -i :5173 | grep LISTEN; then
  echo "Killing process on port 5173 (frontend)..."
  lsof -ti :5173 | xargs kill -9
fi

# Kill backend (FastAPI, port 8000)
if lsof -i :8000 | grep LISTEN; then
  echo "Killing process on port 8000 (backend)..."
  lsof -ti :8000 | xargs kill -9
fi

echo "Starting frontend (Vite)..."
npm run dev &
FRONTEND_PID=$!

sleep 2

echo "Starting backend (FastAPI)..."
cd backend && (
  # Use your preferred backend start command
  uvicorn app.run:app --reload --host 0.0.0.0 --port 8000 &
  BACKEND_PID=$!
  wait $BACKEND_PID
)

wait $FRONTEND_PID
