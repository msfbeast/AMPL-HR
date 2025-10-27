#!/bin/bash

# Vercel Deployment Script
echo "🚀 Recruitment Sandbox Deployment to Vercel"
echo "=========================================="

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi
echo "✅ Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install Node.js (which includes npm) and try again."
    exit 1
fi
echo "✅ npm is installed"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "⚠️  Vercel CLI is not installed. Installing..."
    npm install -g vercel
    if ! command -v vercel &> /dev/null
    then
        echo "❌ Failed to install Vercel CLI. Please install it manually with 'npm install -g vercel'"
        exit 1
    fi
fi
echo "✅ Vercel CLI is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️  Building the project..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "📋 Deployment Instructions:"
echo "1. Run 'vercel login' to log in to your Vercel account"
echo "2. Run 'vercel' to deploy"
echo "3. After deployment, run 'vercel env add GEMINI_API_KEY' to add your API key"
echo "4. Finally, run 'vercel --prod' to deploy to production"
echo ""
echo "📝 Note: You'll need a Gemini API key from https://aistudio.google.com/app/apikey"
echo ""
echo "🌐 Alternative: Deploy via Vercel Dashboard"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to https://vercel.com/new"
echo "3. Import your repository"
echo "4. Add GEMINI_API_KEY environment variable in project settings"
echo "5. Deploy!"