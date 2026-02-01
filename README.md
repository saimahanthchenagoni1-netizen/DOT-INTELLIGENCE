<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Dot AI - Your Personal Study Companion 🎓

An AI-powered study application built with React, TypeScript, and Vite, leveraging Google's Gemini API to provide intelligent tutoring, quiz generation, and flashcard creation.

**View your app in AI Studio:** https://ai.studio/apps/drive/1dWKw0GKmk4CyYnNiqrXjtmsPsElS6fJN

## 🚀 Features

- ✨ **Interactive AI Chatbot** - Get instant explanations and personalized tutoring
- 📝 **Quiz Generation** - Auto-generate quizzes from any content with multiple difficulty levels
- 🎯 **Flashcard System** - Create and study flashcards for efficient learning
- 📚 **Study Guides** - AI-generated comprehensive study guides
- 🎨 **Responsive Design** - Beautiful, modern UI with customizable themes
- 💾 **Local Storage** - Save your quizzes and flashcards persistently

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or yarn
- **Google Gemini API Key** ([Get it here](https://aistudio.google.com/app/apikey))

## 🛠️ Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/dot-ai---your-personal-study-companion.git
cd dot-ai---your-personal-study-companion
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
# The .env.local file is already set up with your API key
# File location: .env.local
GEMINI_API_KEY=your_api_key_here
```

4. **Run the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📖 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🚢 Deployment to Vercel

### Option 1: Automatic Deployment (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Set environment variables:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** Your Gemini API key
   - Click "Deploy"

### Option 2: Using Vercel CLI

```bash
npm i -g vercel
vercel env add GEMINI_API_KEY
vercel deploy --prod
```

### Option 3: GitHub Actions (Automatic)

The repository includes GitHub Actions workflows that automatically:
- Build and test on every push
- Deploy to Vercel on main branch push

**Setup required:**
1. Add these secrets to your GitHub repository (Settings → Secrets):
   - `VERCEL_TOKEN` - [Create here](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` - From your Vercel account settings
   - `VERCEL_PROJECT_ID` - From your Vercel project settings
   - `GEMINI_API_KEY` - Your API key

## 🔐 Security Checklist

✅ **`.env.local` is in `.gitignore`** - Never committed to repository
✅ **Use `.env.example`** - Template for environment variables
✅ **Environment variables in Vercel** - API keys stored in Vercel project settings
✅ **GitHub Secrets** - Sensitive tokens stored as GitHub secrets

**Important:** Never hardcode API keys in your code or commit `.env.local`

## 📁 Project Structure

```
.
├── components/              # React components
│   ├── BackgroundEffects.tsx
│   ├── Flashcards.tsx
│   ├── Home.tsx
│   ├── Quiz.tsx
│   ├── Results.tsx
│   ├── Settings.tsx
│   └── Sidebar.tsx
├── services/               # API services
│   └── geminiService.ts
├── App.tsx                # Main application component
├── types.ts               # TypeScript type definitions
├── index.tsx              # React entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
├── .env.local            # Local environment variables (NOT committed)
├── .env.example          # Environment template (for reference)
├── vercel.json           # Vercel deployment configuration
└── .github/workflows/    # GitHub Actions workflows
    ├── deploy.yml        # Deployment workflow
    └── lint.yml          # Build check workflow
```

## 🛠️ Technology Stack

- **Frontend:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **AI API:** Google Gemini API (v1.3.0)
- **Styling:** CSS with responsive design
- **State Management:** React Hooks

## 🌐 Supported Platforms

- ✅ Vercel
- ✅ Netlify
- ✅ GitHub Pages
- ✅ Any static hosting service

## 📝 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API Key | ✅ Yes | `AIza...` |

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### API Key Issues
- Verify the key is valid at [AI Studio](https://aistudio.google.com/app/apikey)
- Check `.env.local` has no extra spaces or quotes
- In Vercel, ensure `GEMINI_API_KEY` is set in project settings

### Port Already in Use
```bash
# Change the port in vite.config.ts or use:
npm run dev -- --port 3001
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Vercel Documentation](https://vercel.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎉 Ready to Deploy?

Your application is now ready for production deployment! 

**Quick Start:**
1. Push to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repo and add the `GEMINI_API_KEY`
4. Deploy! 🚀
