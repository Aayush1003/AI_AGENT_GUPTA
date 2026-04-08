@echo off
echo ========================================
echo AI Digital Life Orchestrator Setup
echo ========================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

echo Node.js found: 
node -v
echo.

REM Setup Backend
echo ========================================
echo Setting up BACKEND...
echo ========================================
cd backend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed
)

REM Create .env file if not exists
if not exist .env (
    echo Creating .env file... (You need to add GEMINI_API_KEY)
    copy .env.example .env
    echo WARNING: Edit .env and add your GEMINI_API_KEY
    echo Get it from: https://ai.google.dev
    pause
)

cd ..
echo Backend setup COMPLETE!
echo.

REM Setup Frontend  
echo ========================================
echo Setting up FRONTEND...
echo ========================================
cd frontend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed
)

REM Create .env file if not exists
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)

cd ..
echo Frontend setup COMPLETE!
echo.

echo ========================================
echo Setup finished!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend/.env and add GEMINI_API_KEY
echo 2. Run: npm start:all
echo    OR run manually:
echo    - Terminal 1: cd backend ^&^& npm run dev
echo    - Terminal 2: cd frontend ^&^& npm start
echo.
pause
