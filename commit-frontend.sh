#!/bin/bash

echo "🎨 JoltCab Frontend - Git Commit & Push"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd "$(dirname "$0")"

echo -e "${BLUE}📋 Checking git status in frontend/...${NC}"
git status --short

echo ""
echo -e "${YELLOW}📦 Staging all frontend changes...${NC}"
git add .

echo ""
echo -e "${GREEN}✅ Creating commit...${NC}"
git commit -m "🎨 Feat: AI-Powered User Dashboard with Dynamic Pricing

✨ Features:
- Modernized Dashboard with AI-powered quick booking
- New BookRide flow with 3-step wizard
- Real-time AI dynamic pricing display
- Framer-motion animations throughout
- Full backend AI integration (no mock data)

🔧 Technical:
- New aiService.js with 7 AI functions
- Dashboard.jsx completely redesigned
- BookRide.jsx multi-step booking flow
- Real API calls to /api/ai/pricing/calculate
- Animated UI components with framer-motion

📦 Dependencies:
- framer-motion, lucide-react, react-hot-toast

✅ Integration:
- Full backend AI endpoint integration
- Real-time pricing calculations
- No simulation or mock data

🎯 User Experience:
- Smooth animations and transitions
- Clear pricing breakdown
- Demand indicators
- Service type selection
- Step-by-step booking guidance"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Commit created successfully!${NC}"
    echo ""
    echo -e "${BLUE}🚀 Pushing to GitHub (frontend repo)...${NC}"
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅✅✅ Successfully pushed frontend to GitHub!${NC}"
        echo ""
        echo -e "${YELLOW}📌 Optional: Create a release tag${NC}"
        echo "cd frontend && git tag -a v2.0.0-ai-frontend -m 'AI Frontend Release' && git push origin v2.0.0-ai-frontend"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Push failed. You may need to pull first:${NC}"
        echo "cd frontend && git pull origin main --rebase && git push origin main"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Commit failed. Check the error above.${NC}"
fi

echo ""
echo "========================================"
echo "🎉 Frontend commit done!"
