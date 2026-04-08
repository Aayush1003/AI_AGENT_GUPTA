#!/bin/bash
set -e

echo "========================================"
echo "AI Digital Life Orchestrator Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Download from: https://nodejs.org"
    exit 1
fi

echo "Node.js found:"
node -v
echo ""

# Setup Backend
echo "========================================"
echo "Setting up BACKEND..."
echo "========================================"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env file... (You need to add GEMINI_API_KEY)"
    cp .env.example .env
    echo "WARNING: Edit .env and add your GEMINI_API_KEY"
    echo "Get it from: https://ai.google.dev"
fi

cd ..
echo "Backend setup COMPLETE!"
echo ""

# Setup Frontend
echo "========================================"
echo "Setting up FRONTEND..."
echo "========================================"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

cd ..
echo "Frontend setup COMPLETE!"
echo ""

echo "========================================"
echo "Setup finished!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add GEMINI_API_KEY"
echo "2. Run both services:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm start"
echo ""
echo "Then visit: http://localhost:3000"
