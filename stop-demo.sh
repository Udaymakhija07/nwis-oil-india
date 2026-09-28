#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

if [ -f .nwis_pids ]; then
  echo "Stopping NWIS microservices..."
  read AI_PID BACKEND_PID FRONTEND_PID < .nwis_pids
  kill $AI_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  rm -f .nwis_pids
  echo "All NWIS services stopped successfully."
else
  # Fallback kill by port
  lsof -ti :8000 | xargs kill -9 2>/dev/null || true
  lsof -ti :5050 | xargs kill -9 2>/dev/null || true
  lsof -ti :5173 | xargs kill -9 2>/dev/null || true
  echo "Cleaned up processes on ports 8000, 5050, 5173."
fi
