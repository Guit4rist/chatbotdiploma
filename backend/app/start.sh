#!/usr/bin/env bash

# Get the project root directory
PROJECT_ROOT=$(pwd)

# Build the frontend
cd "$PROJECT_ROOT/frontend"
echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

# Verify the build
if [ ! -d "dist" ]; then
    echo "Error: Frontend build failed - dist directory not found"
    exit 1
fi

# Start the backend server
cd "$PROJECT_ROOT/backend"
echo "Starting backend server..."
uvicorn app.main:app --host 0.0.0.0 --port 10000
