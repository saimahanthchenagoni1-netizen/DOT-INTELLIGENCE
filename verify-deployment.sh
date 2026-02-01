#!/bin/bash
# Pre-deployment verification script
# Run this before deploying to verify everything is configured

echo "🔍 Dot AI - Deployment Verification Script"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} File exists: $1"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} File missing: $1"
        ((FAILED++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} Directory exists: $1"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} Directory missing: $1"
        ((FAILED++))
    fi
}

echo "📋 Checking Configuration Files..."
check_file "package.json"
check_file "vite.config.ts"
check_file "tsconfig.json"
check_file ".env.local"
check_file ".env.example"
check_file ".gitignore"
check_file "vercel.json"
check_file ".vercelignore"
check_file ".npmrc"
check_file ".editorconfig"
echo ""

echo "📁 Checking Directory Structure..."
check_dir "components"
check_dir "services"
check_dir ".github/workflows"
echo ""

echo "📚 Checking Documentation..."
check_file "README.md"
check_file "QUICK_START.md"
check_file "COMPLETE_DEPLOYMENT_GUIDE.md"
check_file "DEPLOYMENT_CHECKLIST.md"
check_file "DEPLOYMENT.md"
check_file "DEPLOYMENT_SUMMARY.md"
check_file "MAINTENANCE.md"
echo ""

echo "🔧 Checking GitHub Workflows..."
check_file ".github/workflows/deploy.yml"
check_file ".github/workflows/lint.yml"
echo ""

echo "🛡️ Checking Security..."
if grep -q "\.env\.local" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✅${NC} .env.local is in .gitignore"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} .env.local NOT in .gitignore - SECURITY RISK!"
    ((FAILED++))
fi
echo ""

echo "📦 Checking Environment Variables..."
if [ -f ".env.local" ] && grep -q "GEMINI_API_KEY=" .env.local; then
    echo -e "${GREEN}✅${NC} GEMINI_API_KEY is set in .env.local"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} GEMINI_API_KEY not found in .env.local"
    ((FAILED++))
fi
echo ""

echo "================================"
echo -e "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo "================================"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Your project is ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. npm run build (test locally)"
    echo "2. git push origin main"
    echo "3. Go to vercel.com/new"
    echo "4. Import your GitHub repository"
    echo "5. Add GEMINI_API_KEY environment variable"
    echo "6. Deploy! 🚀"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
