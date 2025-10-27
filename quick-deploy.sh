#!/bin/bash

# Quick Deployment Script for Vercel
echo "🚀 Quick Vercel Deployment"
echo "=========================="

# Check if vercel is installed
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI could not be found. Installing..."
    npm install -g vercel
fi

echo "1. Please log in to Vercel:"
echo "   Run: vercel login"
echo ""
echo "2. After logging in, deploy with:"
echo "   Run: vercel"
echo ""
echo "3. When prompted, use these settings:"
echo "   - Set up and deploy: Y"
echo "   - Which scope: Select your account"
echo "   - Link to existing project: N"
echo "   - Project name: recruitment-sandbox"
echo "   - In which directory: ."
echo "   - Override settings: N"
echo ""
echo "4. After initial deployment, add your API key:"
echo "   Run: vercel env add GEMINI_API_KEY"
echo ""
echo "5. Finally, deploy to production:"
echo "   Run: vercel --prod"
echo ""
echo "📝 Note: Get your Gemini API key from https://aistudio.google.com/app/apikey"