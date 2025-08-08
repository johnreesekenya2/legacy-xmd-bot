
#!/bin/bash

echo "🚀 LEGACY XMD - GitHub Setup Script"
echo "====================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if GitHub token is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ GITHUB_TOKEN not found!${NC}"
    echo -e "${YELLOW}💡 Please set your GitHub Personal Access Token:${NC}"
    echo -e "${CYAN}   1. Go to https://github.com/settings/tokens${NC}"
    echo -e "${CYAN}   2. Click 'Generate new token (classic)'${NC}"
    echo -e "${CYAN}   3. Select scopes: repo, workflow${NC}"
    echo -e "${CYAN}   4. Copy the token and run:${NC}"
    echo -e "${GREEN}      export GITHUB_TOKEN=\"your_token_here\"${NC}"
    echo ""
    read -p "Enter your GitHub token: " token
    export GITHUB_TOKEN="$token"
fi

# Check if username is set
if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${BLUE}📝 GitHub username not set${NC}"
    read -p "Enter your GitHub username: " username
    export GITHUB_USERNAME="$username"
fi

# Check if repo name is set
if [ -z "$REPO_NAME" ]; then
    echo -e "${BLUE}📝 Repository name not set${NC}"
    read -p "Enter repository name (default: legacy-xmd-bot): " reponame
    export REPO_NAME="${reponame:-legacy-xmd-bot}"
fi

echo ""
echo -e "${CYAN}🔧 Configuration:${NC}"
echo -e "${BLUE}   Username: $GITHUB_USERNAME${NC}"
echo -e "${BLUE}   Repository: $REPO_NAME${NC}"
echo -e "${BLUE}   Token: ${GITHUB_TOKEN:0:8}...${NC}"
echo ""

# Run the upload script
echo -e "${GREEN}🚀 Starting upload...${NC}"
node upload_to_github.js

echo ""
echo -e "${GREEN}✅ Setup completed!${NC}"
echo -e "${CYAN}🌐 Your repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
