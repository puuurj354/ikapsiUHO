#!/bin/bash
# Pre-commit script to ensure frontend assets are built
# Copy this to .git/hooks/pre-commit and make it executable: chmod +x .git/hooks/pre-commit

echo "🔍 Checking frontend assets..."

# Check if frontend source files changed
FRONTEND_CHANGED=$(git diff --cached --name-only | grep -c "resources/js\|vite.config\|package.json\|bun.lockb" || true)

if [ "$FRONTEND_CHANGED" -gt 0 ]; then
    echo "📦 Frontend files changed, rebuilding assets..."
    
    bun run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Assets built successfully"
        # Add build files to commit
        git add public/build
        echo "✅ Build files added to commit"
    else
        echo "❌ Build failed! Please fix errors before committing."
        exit 1
    fi
else
    echo "✅ No frontend changes detected"
fi

exit 0
