# Deploy to Vercel Dashboard

Since we're experiencing issues with the CLI deployment, let's deploy using the Vercel Dashboard instead.

## Steps:

1. **Go to the Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Make sure you're logged in with the same account you used for `vercel login`

2. **Create a New Project**
   - Click the "New Project" button
   - If you see a list of your Git repositories, find "AMPL-HR" in the list
   - If you don't see it, click "Import Third-Party Git Repository" and enter:
     ```
     https://github.com/msfbeast/AMPL-HR
     ```

3. **Configure Project Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables**
   - Click "Environment Variables"
   - Add a new variable:
     - Name: `GEMINI_API_KEY`
     - Value: Your actual Gemini API key (get from https://aistudio.google.com/app/apikey)
   - Make sure it's available for both Development and Production

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)

## Troubleshooting

If you encounter issues:

1. **Build Errors**: Make sure all dependencies are properly specified in package.json
2. **Routing Issues**: The vercel.json file handles routing for client-side navigation
3. **API Key Issues**: Ensure your GEMINI_API_KEY environment variable is correctly set

## Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repository: https://github.com/msfbeast/AMPL-HR
- Gemini API Key: https://aistudio.google.com/app/apikey