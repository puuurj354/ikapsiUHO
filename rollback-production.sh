#!/bin/bash
# Rollback Script untuk iKAPSI UHO Production
# Usage: ./rollback-production.sh [commit-hash]
# Example: ./rollback-production.sh HEAD~1
# Or: ./rollback-production.sh abc123

set -e

ROLLBACK_TO="${1:-HEAD~1}"

echo "======================================"
echo "  iKAPSI UHO Production Rollback"
echo "======================================"
echo ""
echo "⚠️  WARNING: This will rollback production to: $ROLLBACK_TO"
echo ""
read -p "Are you sure you want to continue? (yes/no) " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Rollback cancelled."
    exit 1
fi

echo "🔄 Starting rollback process..."
echo ""

# SSH ke VPS dan rollback
ssh admin@147.93.81.147 << ENDSSH
set -e

cd ~/Documents/ikapsiUHO

echo "  → Current commit:"
git log -1 --oneline

echo ""
echo "  → Rolling back to: $ROLLBACK_TO"
git fetch origin main
git reset --hard $ROLLBACK_TO

echo "  → Clearing all caches..."
docker-compose exec -T ikapsi-app php artisan cache:clear
docker-compose exec -T ikapsi-app php artisan config:clear
docker-compose exec -T ikapsi-app php artisan route:clear
docker-compose exec -T ikapsi-app php artisan view:clear

echo "  → Running migrations..."
docker-compose exec -T ikapsi-app php artisan migrate --force

echo "  → Rebuilding caches..."
docker-compose exec -T ikapsi-app php artisan config:cache
docker-compose exec -T ikapsi-app php artisan route:cache
docker-compose exec -T ikapsi-app php artisan view:cache

echo "  → Restarting application..."
docker-compose restart ikapsi-app

echo "  → Waiting for application to be healthy..."
sleep 5

# Health check
HEALTH_CHECK=\$(docker-compose exec -T ikapsi-app curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")

if [ "\$HEALTH_CHECK" == "200" ] || [ "\$HEALTH_CHECK" == "302" ]; then
    echo "  ✅ Health check passed (HTTP \$HEALTH_CHECK)"
else
    echo "  ⚠️  Warning: Health check returned HTTP \$HEALTH_CHECK"
fi

echo ""
echo "  → Rolled back to:"
git log -1 --oneline

echo ""
echo "✅ Rollback completed!"
ENDSSH

echo ""
echo "======================================"
echo "  🔄 Production has been rolled back!"
echo "======================================"
echo ""
echo "🌐 Website: https://ikapsi.horus.my.id"
echo ""
echo "⚠️  Note: You may need to sync your local repository:"
echo "   git fetch origin main"
echo "   git reset --hard origin/main"
echo ""
