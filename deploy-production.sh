#!/bin/bash
# Deployment Script untuk iKAPSI UHO Production
# Usage: ./deploy-production.sh

set -e

echo "======================================"
echo "  iKAPSI UHO Production Deployment"
echo "======================================"
echo ""

# 1. Push ke GitHub
echo "📤 Step 1: Pushing changes to GitHub..."
git push origin main

# 2. SSH ke VPS dan deploy
echo "🚀 Step 2: Deploying to production server..."
ssh admin@147.93.81.147 << 'ENDSSH'
cd ~/Documents/ikapsiUHO

echo "  → Fetching latest from GitHub..."
git fetch origin main

echo "  → Pulling changes..."
git pull origin main

echo "  → Checking for dependency changes..."
COMPOSER_CHANGED=$(git diff HEAD@{1} --name-only | grep -c "composer.lock" || true)
PACKAGE_CHANGED=$(git diff HEAD@{1} --name-only | grep -c "package.json\|bun.lockb" || true)

if [ "$COMPOSER_CHANGED" -gt 0 ]; then
    echo "  → Installing PHP dependencies..."
    docker-compose exec -T ikapsi-app composer install --no-dev --optimize-autoloader
fi

if [ "$PACKAGE_CHANGED" -gt 0 ]; then
    echo "  → Installing JS dependencies and building..."
    docker-compose exec -T ikapsi-app bash -c 'export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH" && bun install && bun run build'
fi

echo "  → Running migrations..."
docker-compose exec -T ikapsi-app php artisan migrate --force

echo "  → Optimizing application..."
docker-compose exec -T ikapsi-app php artisan optimize:clear
docker-compose exec -T ikapsi-app php artisan config:cache
docker-compose exec -T ikapsi-app php artisan route:cache
docker-compose exec -T ikapsi-app php artisan view:cache

echo "  → Restarting containers..."
docker-compose restart ikapsi-app

echo ""
echo "✅ Deployment completed!"
ENDSSH

echo ""
echo "======================================"
echo "  🎉 Production is now updated!"
echo "======================================"
echo ""
echo "🌐 Website: https://ikapsi.horus.my.id"
echo "👤 Admin: admin@ikapsiuho.id / password"
echo ""
