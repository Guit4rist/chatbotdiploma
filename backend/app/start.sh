#!/usr/bin/env bash

# Build the frontend
cd ../frontend
npm install
npm run build

# Start the backend server
cd ../backend
uvicorn app.main:app --host 0.0.0.0 --port 10000
