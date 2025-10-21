@echo off
title Meghana Sukamanchi Fashion Designer - Vercel Deployment

echo.
echo 🎨 Meghana Sukamanchi Fashion Designer Website Deployment
echo =========================================================
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Error: index.html not found. Please run this script from the project directory.
    pause
    exit /b 1
)

echo 📁 Files in project directory:
dir /b

echo.
echo 🔍 Checking required files...

REM Check for required files
set "files_missing=0"

if exist "index.html" (
    echo ✅ index.html - Found
) else (
    echo ❌ index.html - Missing
    set "files_missing=1"
)

if exist "styles.css" (
    echo ✅ styles.css - Found
) else (
    echo ❌ styles.css - Missing
    set "files_missing=1"
)

if exist "script.js" (
    echo ✅ script.js - Found
) else (
    echo ❌ script.js - Missing
    set "files_missing=1"
)

if exist "package.json" (
    echo ✅ package.json - Found
) else (
    echo ❌ package.json - Missing
    set "files_missing=1"
)

if exist "vercel.json" (
    echo ✅ vercel.json - Found
) else (
    echo ❌ vercel.json - Missing
    set "files_missing=1"
)

if "%files_missing%"=="1" (
    echo.
    echo ❌ Some required files are missing!
    echo Please ensure all files are present before deploying.
    pause
    exit /b 1
)

echo.
echo 🚀 All required files present! Ready for deployment.
echo.
echo Choose deployment method:
echo 1^) Deploy with Vercel CLI (requires Vercel CLI installed^)
echo 2^) Show GitHub upload instructions
echo 3^) Show manual Vercel instructions
echo 4^) Open Vercel website
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Deploying with Vercel CLI...
    
    REM Check if Node.js is available
    node --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Node.js not found. Please install Node.js first from https://nodejs.org
        pause
        exit /b 1
    )
    
    REM Check if Vercel CLI is installed
    vercel --version >nul 2>&1
    if errorlevel 1 (
        echo 📦 Installing Vercel CLI...
        npm install -g vercel
    )
    
    echo 📡 Starting Vercel deployment...
    vercel --prod
    
    echo ✅ Deployment process initiated!
    echo 🌐 Check your terminal for the deployment URL!
    
) else if "%choice%"=="2" (
    echo.
    echo 📤 GitHub Upload Instructions:
    echo ================================
    echo 1. Go to https://github.com and create a new repository
    echo 2. Name it: meghana-sukamanchi-fashion
    echo 3. Upload all files from this directory to the repository
    echo 4. Go to https://vercel.com and import from GitHub
    echo 5. Select your repository and deploy
    echo.
    echo 🌐 Opening GitHub...
    start https://github.com/new
    
) else if "%choice%"=="3" (
    echo.
    echo 📁 Manual Vercel Instructions:
    echo ==============================
    echo 1. Go to https://vercel.com
    echo 2. Click 'New Project'
    echo 3. Choose 'Browse All Templates'
    echo 4. Select 'Deploy from local files'
    echo 5. Drag and drop this entire project folder
    echo 6. Click 'Deploy'
    echo.
    echo 🌐 Opening Vercel...
    start https://vercel.com/new
    
) else if "%choice%"=="4" (
    echo.
    echo 🌐 Opening Vercel website...
    start https://vercel.com
    
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 📋 Post-deployment checklist:
echo • Test all animations and transitions
echo • Verify WhatsApp contact integration  
echo • Check mobile responsiveness
echo • Confirm all images load correctly
echo • Test portfolio filtering
echo.
echo 🎉 Happy deploying! Your fashion website will look amazing! ✨
echo.
pause