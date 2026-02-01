# Vercel Deployment Checklist ✅

Before deploying to Vercel, ensure:

## Pre-Deployment

- [ ] All code is committed to GitHub
- [ ] Repository is public or you have Vercel Pro
- [ ] API key works in local development
- [ ] `npm run build` completes successfully
- [ ] No hardcoded API keys or secrets in code
- [ ] `.env.local` is in `.gitignore` (it is by default)
- [ ] `.env.example` exists as template

## GitHub Setup

- [ ] Repository pushed to GitHub
- [ ] Branch is either `main` or `master`
- [ ] `.github/workflows/` files are in place
- [ ] No sensitive data in commit history

## Vercel Setup

1. **Create Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Vercel auto-detects Vite configuration

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_api_key_here`
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - View live URL

## Post-Deployment

- [ ] Visit live URL and test functionality
- [ ] Check that AI features work
- [ ] Verify no console errors
- [ ] Test on mobile devices
- [ ] Set up custom domain if desired
- [ ] Configure analytics

## GitHub Actions Setup (Optional but Recommended)

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `VERCEL_TOKEN` - [Get from vercel.com/account/tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` - From Vercel account settings
   - `VERCEL_PROJECT_ID` - From Vercel project settings
   - `GEMINI_API_KEY` - Your API key

3. GitHub Actions will now:
   - Run builds on every push
   - Auto-deploy on main branch push

## Troubleshooting

**Build fails on Vercel:**
- Check build logs in Vercel Dashboard
- Ensure Node version compatibility
- Verify environment variables are set

**Features not working:**
- Check that `GEMINI_API_KEY` is set in Vercel
- Verify API key is valid
- Check browser console for errors

**Can't connect to Vercel:**
- Verify GitHub token permissions
- Check Vercel project settings
- Ensure repository is public

## Monitoring

- Set up Vercel Analytics
- Monitor performance metrics
- Review deployment history regularly
- Check error tracking

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Vite Docs](https://vitejs.dev)

---

**You're all set! 🚀**

Your app is now ready for production deployment to Vercel!
