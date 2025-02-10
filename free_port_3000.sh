#!/bin/bash

PORT=4000

echo "Checking for processes running on port $PORT..."

# Find the process ID (PID) using the port
PID=$(lsof -t -i:$PORT)

if [ -z "$PID" ]; then
  echo "No process is using port $PORT."
else
  echo "Process found on port $PORT with PID: $PID"
  echo "Killing the process..."
  kill -9 $PID
  if [ $? -eq 0 ]; then
    echo "Successfully killed process with PID $PID on port $PORT."
  else
    echo "Failed to kill process with PID $PID. You might need sudo privileges."
  fi
fi

