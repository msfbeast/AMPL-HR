# Deployment Guide

## Deploying to Vercel

This application can be easily deployed to Vercel. Follow these steps:

1. **Prepare Your Repository**
   - Ensure all your code is committed and pushed to a GitHub repository
   - The repository should contain all the files from this project

2. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com/) and sign up or log in

3. **Import Your Project**
   - Click "New Project" in your Vercel dashboard
   - Import your GitHub repository
   - Vercel will automatically detect that it's a Vite project

4. **Configure Environment Variables**
   - In the Vercel project settings, go to the "Environment Variables" section
   - Add a new environment variable:
     - Name: `GEMINI_API_KEY`
     - Value: Your actual Gemini API key (get one at https://aistudio.google.com/app/apikey)

5. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Vercel will provide you with a deployment URL

## Technical Details

- **Build Command**: `npm run vercel-build` (custom script that runs `vite build`)
- **Output Directory**: `dist` (default Vite output)
- **Environment**: The application will automatically use the `GEMINI_API_KEY` from Vercel's environment variables

## Troubleshooting

If you encounter issues:

1. **API Key Issues**: Ensure your `GEMINI_API_KEY` environment variable is correctly set in Vercel
2. **Build Issues**: Check the build logs in Vercel for any errors
3. **Runtime Issues**: Check the browser console for any errors related to API calls

## Custom Domain

To use a custom domain:
1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain and follow the DNS configuration instructions