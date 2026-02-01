# 🚀 Deployment Guide - Dot AI

Complete guide to deploy your Dot AI application to Vercel with GitHub integration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [GitHub Actions Setup](#github-actions-setup)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)
7. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before starting, ensure you have:

- ✅ GitHub account ([github.com](https://github.com))
- ✅ Vercel account ([vercel.com](https://vercel.com)) - Sign in with GitHub
- ✅ Git installed locally
- ✅ Node.js 18+ installed
- ✅ Google Gemini API Key ([Get here](https://aistudio.google.com/app/apikey))

---

## GitHub Setup

### Step 1: Initialize Git Repository

If not already done:

```bash
git init
git add .
git commit -m "Initial commit: Dot AI ready for deployment"
git branch -M main
```

### Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `dot-ai---your-personal-study-companion` (or your choice)
3. Choose **Public** (required for free Vercel deployment)
4. Click **Create Repository**

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/dot-ai---your-personal-study-companion.git
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Vercel Deployment

### Option A: Quick Deploy (Recommended)

1. **Visit Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub

2. **Import Project:**
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

3. **Configure Settings:**
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `npm run build` (should be preset)
   - Output Directory: `dist` (should be preset)
   - Install Command: `npm ci` (should be preset)

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyBlSGCSk9fa7txl21V_aoJVDhiqQPMr6kg`
   - Click "Add"

5. **Deploy:**
   - Click **Deploy**
   - Wait for build (2-3 minutes)
   - Get your live URL! 🎉

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod

# Set environment variable
vercel env add GEMINI_API_KEY
# Then paste: AIzaSyBlSGCSk9fa7txl21V_aoJVDhiqQPMr6kg
```

---

## GitHub Actions Setup

### Option: Automatic Deployment on Push

GitHub Actions workflows are already configured. To enable auto-deployment:

1. **Get Vercel Tokens:**

   a. **VERCEL_TOKEN:**
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Click "Create"
   - Copy the token

   b. **VERCEL_ORG_ID & VERCEL_PROJECT_ID:**
   - Go to your Vercel project dashboard
   - Settings → General
   - Copy `ORG ID` and `PROJECT ID`

2. **Add GitHub Secrets:**

   Go to your GitHub repository → Settings → Secrets and variables → Actions

   Add these secrets:
   - `VERCEL_TOKEN` - (from step 1a)
   - `VERCEL_ORG_ID` - (from step 1b)
   - `VERCEL_PROJECT_ID` - (from step 1b)
   - `GEMINI_API_KEY` - Your Gemini API key

3. **Test:**

   ```bash
   git push origin main
   ```

   Check GitHub Actions tab to see deployment progress!

---

## Environment Variables

### Local Development

Your API key is in `.env.local`:
```
GEMINI_API_KEY=AIzaSyBlSGCSk9fa7txl21V_aoJVDhiqQPMr6kg
```

### Production (Vercel)

1. Go to Vercel Project Dashboard
2. Settings → Environment Variables
3. Add each environment variable needed

### Sharing Configuration

Use `.env.example` as template for team members:

```bash
cp .env.example .env.local
# Team members fill in their own API key
```

---

## Troubleshooting

### Build Fails

**Problem:** `npm ERR!` or build error

**Solution:**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### API Key Not Working

**Problem:** "Invalid API Key" error

**Checklist:**
- [ ] Key is correct in `.env.local`
- [ ] No extra spaces or quotes
- [ ] Vercel environment variable is set
- [ ] Key is valid at [aistudio.google.com](https://aistudio.google.com)

**Fix in Vercel:**
1. Go to Project Settings
2. Check Environment Variables
3. Redeploy after updating

### Port 3000 in Use

```bash
npm run dev -- --port 3001
```

### Node Version Mismatch

In `vercel.json`, specify Node version:
```json
{
  "buildCommand": "npm run build",
  "nodeVersion": "20.x"
}
```

### GitHub Actions Secret Issues

**Problem:** `"Error: Secrets not found"`

**Solution:**
1. Check secrets are added to correct repository
2. Wait 2-3 minutes for secrets to sync
3. Use exact names: `VERCEL_TOKEN`, not `vercelToken`

---

## Post-Deployment

### Testing

1. Visit your live URL
2. Test core features:
   - ✅ AI chatbot working
   - ✅ Quiz generation
   - ✅ Flashcard creation
   - ✅ No console errors (DevTools)

### Monitoring

1. **Vercel Analytics:**
   - Enable in Project Settings
   - Monitor performance

2. **Error Tracking:**
   - Check deployments in Vercel dashboard
   - Review build logs if issues

### Updates

**To deploy updates:**

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Automatic deployment triggers! (if GitHub Actions enabled)

### Custom Domain

1. Go to Vercel Project Settings
2. Domains → Add Domain
3. Follow instructions

### Rollback

To revert to previous deployment:

1. Vercel Dashboard → Deployments
2. Find previous version
3. Click "Promote to Production"

---

## Security Best Practices

- ✅ **Never commit `.env.local`** - It's in `.gitignore`
- ✅ **Use `.env.example`** - Template only
- ✅ **GitHub Secrets** - For sensitive data
- ✅ **Rotate tokens** - If compromised
- ✅ **Public repositories** - OK for Vercel free tier
- ✅ **Monitor API usage** - Track Gemini API costs

---

## Performance Tips

1. **Monitor Build Time:**
   - Vercel Dashboard → Deployments
   - Typical: 1-3 minutes

2. **Optimize Bundle:**
   - Vite handles this automatically
   - Check bundle size: `npm run build`

3. **Caching:**
   - Vercel caches dependencies
   - Clears on deployment

4. **Analytics:**
   - Enable Vercel Analytics
   - Monitor Web Vitals

---

## Support Resources

| Resource | Link |
|----------|------|
| Vercel Docs | [vercel.com/docs](https://vercel.com/docs) |
| Vite Guide | [vitejs.dev](https://vitejs.dev) |
| React Docs | [react.dev](https://react.dev) |
| Gemini API | [ai.google.dev](https://ai.google.dev) |
| GitHub Help | [docs.github.com](https://docs.github.com) |

---

## Checklist Summary

- [ ] GitHub account created
- [ ] Vercel account created  
- [ ] Repository pushed to GitHub
- [ ] Vercel project imported
- [ ] Environment variables added to Vercel
- [ ] Initial deployment successful
- [ ] Live URL tested and working
- [ ] GitHub Actions secrets added (optional)
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)

---

## Next Steps

After successful deployment:

1. **Share your app:** Tell people about your project!
2. **Add features:** Continue development
3. **Monitor:** Keep an eye on analytics
4. **Update:** Push new versions with git

---

**Congratulations!** 🎉 Your Dot AI app is now live on the internet!

Need help? Check the troubleshooting section above or visit the support resources.

