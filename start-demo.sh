#!/bin/bash
set -e

echo "================================================================="
echo "   🛢️  NWIS: Nearby Wells Intelligence System - SIH 2026       "
echo "   Oil India Limited • eRTMAC Institutional Memory Platform      "
echo "================================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Clean up any lingering demo instances
if [ -f .nwis_pids ]; then
  bash stop-demo.sh >/dev/null 2>&1 || true
fi

echo "[1/3] Starting AI Python Microservice (FastAPI on Port 8000)..."
cd "$DIR/ai-service"
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > "$DIR/ai-service.log" 2>&1 &
AI_PID=$!
echo "      AI Service PID: $AI_PID"

echo "[2/3] Starting Core Backend (Node.js Express on Port 5050)..."
cd "$DIR/backend"
PORT=5050 node src/index.js > "$DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "      Backend PID: $BACKEND_PID"

echo "[3/3] Starting Interactive UI (Vite React on Port 5173)..."
cd "$DIR/frontend"
npx vite --port 5173 --host 0.0.0.0 > "$DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "      Frontend PID: $FRONTEND_PID"

# Save PIDs
echo "$AI_PID $BACKEND_PID $FRONTEND_PID" > "$DIR/.nwis_pids"

sleep 2

echo "-----------------------------------------------------------------"
echo " ✅ NWIS SYSTEM READY FOR LIVE DEMONSTRATION!"
echo "-----------------------------------------------------------------"
echo " 🌐 Frontend UI:        http://localhost:5173"
echo " 🔌 Core REST API:      http://localhost:5050/api/wells"
echo " 🤖 AI Microservice:    http://localhost:8000/docs"
echo " 📊 Health Status:      http://localhost:5050/health"
echo "-----------------------------------------------------------------"
echo " To stop the demo stack at any time, run: bash stop-demo.sh"
echo "================================================================="
