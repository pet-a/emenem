#!/bin/bash
set -e

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Installing Node dependencies ==="
cd frontend
npm install

echo "=== Building React frontend ==="
npm run build

echo "=== Build complete ==="
ls -la dist/