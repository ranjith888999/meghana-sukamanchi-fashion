#!/bin/bash

# Meghana Sukamanchi Fashion Designer Website - Deployment Script
# This script helps deploy the website to Vercel

echo "🎨 Meghana Sukamanchi Fashion Designer Website Deployment"
echo "========================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project directory."
    exit 1
fi

echo "📁 Files in project directory:"
ls -la

echo ""
echo "🔍 Checking required files..."

# Check for required files
required_files=("index.html" "styles.css" "script.js" "package.json" "vercel.json")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - Found"
    else
        echo "❌ $file - Missing"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo ""
    echo "❌ Missing required files: ${missing_files[*]}"
    echo "Please ensure all files are present before deploying."
    exit 1
fi

echo ""
echo "🚀 All required files present! Ready for deployment."
echo ""
echo "Choose deployment method:"
echo "1) Deploy with Vercel CLI (requires Vercel CLI installed)"
echo "2) Show GitHub upload instructions"
echo "3) Show manual Vercel instructions"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying with Vercel CLI..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "❌ Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        echo "📡 Logging in to Vercel..."
        vercel login
        
        echo "🏗️  Deploying to production..."
        vercel --prod
        
        echo "✅ Deployment complete!"
        echo "🌐 Your website should now be live!"
        ;;
    2)
        echo ""
        echo "📤 GitHub Upload Instructions:"
        echo "1. Go to https://github.com and create a new repository"
        echo "2. Name it: meghana-sukamanchi-fashion"
        echo "3. Upload all files from this directory to the repository"
        echo "4. Go to https://vercel.com and import from GitHub"
        echo "5. Select your repository and deploy"
        ;;
    3)
        echo ""
        echo "📁 Manual Vercel Instructions:"
        echo "1. Go to https://vercel.com"
        echo "2. Click 'New Project'"
        echo "3. Choose 'Browse All Templates'"
        echo "4. Select 'Deploy from local files'"
        echo "5. Drag and drop this entire project folder"
        echo "6. Click 'Deploy'"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📋 Post-deployment checklist:"
echo "• Test all animations and transitions"
echo "• Verify WhatsApp contact integration"
echo "• Check mobile responsiveness"
echo "• Confirm all images load correctly"
echo "• Test portfolio filtering"
echo ""
echo "🎉 Happy deploying! Your fashion website will look amazing! ✨"