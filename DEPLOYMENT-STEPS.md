# Vercel Deployment Steps

## Prerequisites
1. Node.js installed on your system
2. A Vercel account (free at https://vercel.com)
3. A Gemini API key (get one at https://aistudio.google.com/app/apikey)

## Deployment Process

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Initial Deployment
```bash
vercel
```

Answer the prompts as follows:
- Set up and deploy: **Y**
- Which scope: Select your account
- Link to existing project: **No**
- Project name: You can use the default or enter a custom name
- In which directory: **.** (current directory)
- Override settings: **No**

### 4. Add Environment Variables
```bash
vercel env add GEMINI_API_KEY
```

When prompted:
1. Select both "production" and "development" environments (use spacebar to select)
2. Enter your actual Gemini API key

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## Alternative: Deploy via Vercel Dashboard

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```

2. Go to https://vercel.com/new
3. Connect your GitHub account
4. Import your repository
5. In the project settings, add the environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your actual Gemini API key
6. Deploy!

## Troubleshooting

If you encounter issues:

1. **Build errors**: Check that all dependencies are properly installed:
   ```bash
   npm install
   npm run build
   ```

2. **API key issues**: Ensure your `GEMINI_API_KEY` environment variable is correctly set in Vercel

3. **Routing issues**: The vercel.json file handles routing for client-side navigation

## Useful Commands

- `vercel` - Deploy to a preview URL
- `vercel --prod` - Deploy to production
- `vercel env pull` - Pull environment variables to .env file
- `vercel logs` - View deployment logs