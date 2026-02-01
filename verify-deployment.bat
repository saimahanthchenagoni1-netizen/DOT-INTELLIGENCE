@echo off
REM Pre-deployment verification script for Windows
REM Run this before deploying to verify everything is configured

echo.
echo 🔍 Dot AI - Deployment Verification Script (Windows)
echo ======================================================
echo.

setlocal enabledelayedexpansion

set PASSED=0
set FAILED=0

echo 📋 Checking Configuration Files...
for %%F in (package.json vite.config.ts tsconfig.json .env.local .env.example .gitignore vercel.json .vercelignore .npmrc .editorconfig) do (
    if exist "%%F" (
        echo ✅ File exists: %%F
        set /a PASSED+=1
    ) else (
        echo ❌ File missing: %%F
        set /a FAILED+=1
    )
)
echo.

echo 📁 Checking Directory Structure...
for %%D in (components services .github\workflows) do (
    if exist "%%D\" (
        echo ✅ Directory exists: %%D
        set /a PASSED+=1
    ) else (
        echo ❌ Directory missing: %%D
        set /a FAILED+=1
    )
)
echo.

echo 📚 Checking Documentation...
for %%F in (README.md QUICK_START.md COMPLETE_DEPLOYMENT_GUIDE.md DEPLOYMENT_CHECKLIST.md DEPLOYMENT.md DEPLOYMENT_SUMMARY.md MAINTENANCE.md) do (
    if exist "%%F" (
        echo ✅ File exists: %%F
        set /a PASSED+=1
    ) else (
        echo ❌ File missing: %%F
        set /a FAILED+=1
    )
)
echo.

echo 🔧 Checking GitHub Workflows...
for %%F in (.github\workflows\deploy.yml .github\workflows\lint.yml) do (
    if exist "%%F" (
        echo ✅ File exists: %%F
        set /a PASSED+=1
    ) else (
        echo ❌ File missing: %%F
        set /a FAILED+=1
    )
)
echo.

echo 🛡️ Checking Security...
findstr /I ".env.local" .gitignore >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ .env.local is in .gitignore
    set /a PASSED+=1
) else (
    echo ❌ .env.local NOT in .gitignore - SECURITY RISK!
    set /a FAILED+=1
)
echo.

echo 📦 Checking Environment Variables...
if exist ".env.local" (
    findstr /I "GEMINI_API_KEY=" .env.local >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ GEMINI_API_KEY is set in .env.local
        set /a PASSED+=1
    ) else (
        echo ❌ GEMINI_API_KEY not found in .env.local
        set /a FAILED+=1
    )
) else (
    echo ❌ .env.local file not found
    set /a FAILED+=1
)
echo.

echo ================================
echo Results: %PASSED% passed, %FAILED% failed
echo ================================
echo.

if %FAILED% equ 0 (
    echo ✅ All checks passed! Your project is ready for deployment.
    echo.
    echo Next steps:
    echo 1. npm run build (test locally)
    echo 2. git push origin main
    echo 3. Go to vercel.com/new
    echo 4. Import your GitHub repository
    echo 5. Add GEMINI_API_KEY environment variable
    echo 6. Deploy! 🚀
    exit /b 0
) else (
    echo ❌ Some checks failed. Please fix the issues above.
    exit /b 1
)
