#!/bin/bash
# Verification Script - Run this to verify the project structure

echo "🔍 Verifying TikTok OAuth Project Structure..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

missing_files=0

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        missing_files=$((missing_files + 1))
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
    else
        echo -e "${RED}✗${NC} $1/ (MISSING)"
        missing_files=$((missing_files + 1))
    fi
}

echo "📂 Checking Directory Structure..."
check_dir "src"
check_dir "src/auth"
check_dir "src/api"
check_dir "src/components"
check_dir "src/pages"
check_dir "src/utils"
check_dir "src/styles"
check_dir "public"

echo ""
echo "📄 Checking Core Files..."
check_file "package.json"
check_file "vite.config.js"
check_file "index.html"
check_file ".gitignore"
check_file "README.md"
check_file "DEPLOYMENT.md"
check_file "QUICK_REFERENCE.md"
check_file "IMPLEMENTATION.md"

echo ""
echo "🔐 Checking Auth Files..."
check_file "src/auth/config.js"
check_file "src/auth/oauth.js"

echo ""
echo "📡 Checking API Files..."
check_file "src/api/tiktokApi.js"

echo ""
echo "🎨 Checking Component Files..."
check_file "src/components/AdCreationForm.jsx"

echo ""
echo "📄 Checking Page Files..."
check_file "src/pages/Dashboard.jsx"
check_file "src/pages/OAuthCallback.jsx"

echo ""
echo "🛠️ Checking Utility Files..."
check_file "src/utils/validation.js"
check_file "src/utils/musicValidation.js"

echo ""
echo "🎨 Checking Style Files..."
check_file "src/styles/index.css"
check_file "src/styles/Dashboard.css"
check_file "src/styles/OAuthCallback.css"
check_file "src/styles/AdCreationForm.css"

echo ""
echo "⚙️ Checking Root Component Files..."
check_file "src/App.jsx"
check_file "src/main.jsx"

echo ""
echo "📰 Checking Public Files..."
check_file "public/terms.html"
check_file "public/privacy.html"

echo ""
if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✅ All files are present!${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "  1. npm install"
    echo "  2. npm run dev"
    echo "  3. Test OAuth flow"
    echo "  4. npm run build"
    echo "  5. npm run deploy"
else
    echo -e "${RED}❌ Missing $missing_files file(s)${NC}"
    echo "Please ensure all files are created before proceeding."
fi
