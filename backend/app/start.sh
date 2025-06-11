#!/usr/bin/env bash

# Get the project root directory
PROJECT_ROOT=$(pwd)

# Build the frontend
cd "$PROJECT_ROOT/frontend"
echo "Installing frontend dependencies..."
npm install
echo "Building frontend..."
npm run build

# Start the backend server
cd "$PROJECT_ROOT/backend"
echo "Starting backend server..."
uvicorn app.main:app --host 0.0.0.0 --port 10000
