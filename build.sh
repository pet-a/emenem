#!/bin/bash
set -e

echo "=== Current directory ==="
pwd

echo "=== Directory contents ==="
ls -la

echo "=== Looking for frontend ==="
find . -name "package.json" -not -path "*/node_modules/*"

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Installing and building frontend ==="
npm install --prefix frontend
npm run build --prefix frontend

echo "=== Build complete ==="
ls -la frontend/dist/