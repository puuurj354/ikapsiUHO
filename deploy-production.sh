#!/bin/bash
# Deployment Script untuk iKAPSI UHO Production
# Usage: ./deploy-production.sh

set -e

echo "======================================"
echo "  iKAPSI UHO Production Deployment"
echo "======================================"
echo ""

# Check if there are uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Warning: You have uncommitted changes!"
    echo ""
    git status -s
    echo ""
    read -p "Do you want to commit them first? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Please commit your changes first, then run this script again."
        exit 1
    fi
fi

# 1. Push ke GitHub
echo "📤 Step 1: Pushing changes to GitHub..."
git push origin main

# 2. SSH ke VPS dan deploy
echo "🚀 Step 2: Deploying to production server..."
ssh admin@147.93.81.147 << 'ENDSSH'
set -e  # Exit on error

cd ~/Documents/ikapsiUHO

echo "  → Checking Docker containers status..."
if ! docker-compose ps | grep -q "ikapsi-app.*Up"; then
    echo "  ❌ Error: Application container is not running!"
    echo "  → Starting containers..."
    docker-compose up -d
    sleep 10
fi

echo "  → Fetching latest from GitHub..."
git fetch origin main

echo "  → Pulling changes..."
git pull origin main

echo "  → Checking for dependency changes..."
COMPOSER_CHANGED=$(git diff HEAD@{1} --name-only | grep -c "composer.lock" || true)
PACKAGE_CHANGED=$(git diff HEAD@{1} --name-only | grep -c "package.json\|bun.lockb" || true)

if [ "$COMPOSER_CHANGED" -gt 0 ]; then
    echo "  → Installing PHP dependencies..."
    docker-compose exec -T ikapsi-app composer install --no-dev --optimize-autoloader --no-interaction
fi

if [ "$PACKAGE_CHANGED" -gt 0 ]; then
    echo "  → Installing JS dependencies and building..."
    docker-compose exec -T ikapsi-app bash -c 'export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH" && bun install && bun run build'
fi

echo "  → Running migrations..."
docker-compose exec -T ikapsi-app php artisan migrate --force

echo "  → Clearing all caches (preventing stale cache issues)..."
docker-compose exec -T ikapsi-app php artisan cache:clear
docker-compose exec -T ikapsi-app php artisan config:clear
docker-compose exec -T ikapsi-app php artisan route:clear
docker-compose exec -T ikapsi-app php artisan view:clear

echo "  → Rebuilding optimized caches..."
docker-compose exec -T ikapsi-app php artisan config:cache
docker-compose exec -T ikapsi-app php artisan route:cache
docker-compose exec -T ikapsi-app php artisan view:cache

echo "  → Gracefully restarting application..."
docker-compose exec -T ikapsi-app php artisan queue:restart 2>/dev/null || true

# Check if critical files changed that require container rebuild
CODE_CHANGED=$(git diff HEAD@{1} --name-only | grep -c "app/Providers\|app/Observers\|Dockerfile\|docker-compose.yml\|docker-entrypoint.sh" || true)

if [ "$CODE_CHANGED" -gt 0 ]; then
    echo "  → Critical code changes detected, rebuilding container..."
    docker-compose down
    docker-compose up -d --build
    echo "  → Waiting for container to be ready..."
    sleep 10
else
    echo "  → Restarting container..."
    docker-compose restart ikapsi-app
    sleep 5
fi

# Health check
echo "  → Running health check..."
HEALTH_CHECK=$(docker-compose exec -T ikapsi-app curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")

if [ "$HEALTH_CHECK" == "200" ]; then
    echo "  ✅ Health check passed (HTTP $HEALTH_CHECK)"
elif [ "$HEALTH_CHECK" == "302" ]; then
    echo "  ✅ Health check passed (HTTP $HEALTH_CHECK - Redirect OK)"
else
    echo "  ⚠️  Warning: Health check returned HTTP $HEALTH_CHECK"
    echo "  → Checking logs..."
    docker-compose logs --tail=20 ikapsi-app
fi

echo ""
echo "✅ Deployment completed!"
ENDSSH

# Verify production is accessible
echo ""
echo "🔍 Verifying production accessibility..."
PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://ikapsi.horus.my.id || echo "000")

if [ "$PROD_STATUS" == "200" ] || [ "$PROD_STATUS" == "302" ]; then
    echo "✅ Production is accessible (HTTP $PROD_STATUS)"
else
    echo "⚠️  Warning: Production returned HTTP $PROD_STATUS"
    echo "   Please check https://ikapsi.horus.my.id manually"
fi

echo ""
echo "======================================"
echo "  🎉 Production is now updated!"
echo "======================================"
echo ""
echo "🌐 Website: https://ikapsi.horus.my.id"
echo "👤 Admin: admin@ikapsiuho.id / password"
echo ""
