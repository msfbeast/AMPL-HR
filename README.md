<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15XYfO51o5RCsumat8NZ_LLrtzX4YXKro

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

### Option 1: Using the Vercel Dashboard (Recommended)

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com/) and create a new project
3. Import your repository
4. Configure the environment variables:
   - Set `GEMINI_API_KEY` to your Gemini API key
5. Deploy!

### Option 2: Using the Automated Deployment Script

1. Make sure you have Node.js installed
2. Run the deployment script:
   ```bash
   ./deploy-to-vercel.sh
   ```
3. Follow the prompts to log in to your Vercel account
4. The script will automatically deploy your application

Note: The application is configured to work with Vercel's static hosting and will automatically use the environment variables you set in your Vercel project settings.