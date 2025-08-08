@echo off
set ORIGINAL_DIR=%cd%
echo ============================================
echo         FARMIO FRONTEND STARTER
echo ============================================
echo.

REM Check if we're in the backend directory and need to go to frontend
@REM if exist "eureka-server" (
    echo Navigating to frontend directory...
    cd /d %~dp0../frontend
@REM )

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js and add it to your PATH
    pause
    exit /b 1
)

echo Node.js is available.
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found
    echo Make sure you're running this from the frontend directory
    pause
    exit /b 1
)

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

echo.
echo ============================================
echo Starting Frontend (React) in Windows Terminal tab...
wt -w 0 nt -d "%~dp0../frontend" --title "Frontend (React)" cmd /k "echo Starting Frontend (React)... && npm run dev"
echo ============================================
echo.
echo Frontend will be available at: http://localhost:5173
echo Make sure your backend services are running!
echo.

REM Start the frontend development server
echo Frontend is running at http://localhost:5173
echo Press any key to exit this window...
pause >nul
cd /d "%ORIGINAL_DIR%"

pause
