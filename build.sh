#!/bin/bash
set -e

echo "=== Installing Node.js ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "=== Node/npm versions ==="
node --version
npm --version

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Installing and building frontend ==="
npm install --prefix frontend
npm run build --prefix frontend

echo "=== Build complete ==="
ls -la frontend/dist/