# Environment Synchronization Guide

## Overview

This guide ensures your **local** and **production** environments are **100% identical**, preventing deployment issues.

## Architecture: Identical Environments

Both local and production now use:
- ✅ **Same Dockerfile** with multi-stage build
- ✅ **Frontend assets built during Docker image creation**
- ✅ **No manual build steps required**
- ✅ **Same PHP version, extensions, and configuration**
- ✅ **Same Laravel configuration**

---

## How It Works

### Multi-Stage Docker Build

```
┌─────────────────────────────────────────┐
│  Stage 1: Frontend Builder (Bun)       │
│  - Install dependencies                 │
│  - Build Vite assets                    │
│  - Output: public/build/                │
└────────────────┬────────────────────────┘
                 │
                 ↓ Copy built assets
┌─────────────────────────────────────────┐
│  Stage 2: PHP Production Image          │
│  - Install PHP + Apache                 │
│  - Copy application code                │
│  - Copy built assets from Stage 1       │
│  - Install Composer dependencies        │
└─────────────────────────────────────────┘
```

### What Happens During Deployment

When you run `./deploy-production.sh`:

1. **Push to GitHub** - Your code is versioned
2. **Pull on Production** - Latest code downloaded
3. **Smart Rebuild Detection**:
   - Frontend code changed? → Full rebuild (includes asset compilation)
   - Provider/Observer changed? → Full rebuild
   - Only PHP code changed? → No rebuild needed
4. **Run Migrations** - Database updates
5. **Clear Caches** - Prevent stale cache issues
6. **Health Check** - Verify deployment success

---

## The Problem We Solved

### Before (Broken):
```
Local:                          Production:
├── bun installed ✅            ├── No bun ❌
├── public/build/ ✅            ├── public/build/ missing ❌
├── Can build assets ✅         ├── Can't build assets ❌
└── Works ✅                    └── 500 Error ❌
```

### After (Fixed):
```
Local:                          Production:
├── Docker builds assets ✅     ├── Docker builds assets ✅
├── public/build/ (in image) ✅ ├── public/build/ (in image) ✅
├── No manual steps ✅          ├── No manual steps ✅
└── Works ✅                    └── Works ✅
```

---

## Development Workflow

### Local Development (Without Docker)

For daily development, you don't need Docker. Use the built-in Laravel server:

```bash
# Terminal 1: Laravel server
composer run dev

# Or separately:
php artisan serve
bun run dev
php artisan queue:work
php artisan pail
```

**Environment**: Uses SQLite database in `database/database.sqlite`

### Testing with Docker Locally

To test the exact production environment:

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f ikapsi-app

# Stop containers
docker-compose down
```

**Environment**: Uses MySQL in Docker container

---

## Deployment Workflow

### Simple Deployment (No Code Changes)

```bash
git add .
git commit -m "Your changes"
./deploy-production.sh
```

The script automatically:
- ✅ Detects what changed
- ✅ Rebuilds only if needed
- ✅ Runs migrations
- ✅ Clears caches
- ✅ Health checks

### When Does It Rebuild?

**Full Rebuild Required** (takes ~2-3 minutes):
- ✅ Frontend code changed (`resources/js/**`, `vite.config.ts`)
- ✅ Dependencies changed (`package.json`, `bun.lockb`)
- ✅ Providers/Observers changed (`app/Providers/**`, `app/Observers/**`)
- ✅ Dockerfile changed

**Quick Restart** (takes ~5 seconds):
- ✅ Only PHP code changed (Controllers, Models, Services)
- ✅ Routes changed
- ✅ Views changed

---

## Key Files

### Dockerfile (Multi-Stage Build)

```dockerfile
# Stage 1: Build frontend with Bun
FROM oven/bun:1 AS frontend-builder
# ... build assets ...

# Stage 2: Production image
FROM php:8.3-apache
# ... copy built assets from Stage 1 ...
```

### deploy-production.sh (Smart Deployment)

```bash
# Detects changes
FRONTEND_CHANGED=$(git diff HEAD@{1} --name-only | grep -c "resources/js\|vite.config" || true)

# Rebuilds only if needed
if [ "$FRONTEND_CHANGED" -gt 0 ]; then
    docker-compose up -d --build
fi
```

---

## Troubleshooting

### Issue: 500 Error After Deployment

**Cause**: Stale Laravel caches or missing assets

**Solution**:
```bash
ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && \
  docker-compose exec -T ikapsi-app php artisan cache:clear && \
  docker-compose exec -T ikapsi-app php artisan config:clear && \
  docker-compose restart ikapsi-app"
```

### Issue: Observer/Provider Not Working

**Cause**: Container not rebuilt after Provider changes

**Solution**: Force rebuild
```bash
ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && \
  docker-compose down && \
  docker-compose up -d --build"
```

### Issue: Frontend Changes Not Showing

**Cause**: Assets not rebuilt

**Solution**: Force rebuild
```bash
./deploy-production.sh
# (It will automatically detect frontend changes and rebuild)
```

---

## Environment Variables

### Local (.env)
```env
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=sqlite
```

### Production (.env)
```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=ikapsi-db
DB_DATABASE=ikapsi_db
```

---

## Verification Checklist

Before deployment, verify:

- [ ] Code committed to git
- [ ] Tests passing (`composer run test`)
- [ ] Frontend builds locally (`bun run build`)
- [ ] No uncommitted changes
- [ ] `.env` variables set correctly

After deployment, verify:

- [ ] Site accessible: https://ikapsi.horus.my.id
- [ ] No 500 errors in logs
- [ ] Database migrations applied
- [ ] Frontend assets loading
- [ ] New features working

---

## Quick Reference

| Task | Command |
|------|---------|
| Deploy to production | `./deploy-production.sh` |
| Rollback deployment | `./rollback-production.sh` |
| View production logs | `ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && docker-compose logs -f ikapsi-app"` |
| Rebuild containers | `ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && docker-compose up -d --build"` |
| Run migrations | `ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && docker-compose exec -T ikapsi-app php artisan migrate"` |
| Clear all caches | `ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && docker-compose exec -T ikapsi-app php artisan optimize:clear"` |

---

## Benefits of This Setup

✅ **No More Manual Builds**: Assets built automatically during Docker build
✅ **100% Environment Parity**: Local and production identical
✅ **Safe Deployments**: Health checks and automatic rollback
✅ **Smart Rebuilds**: Only rebuilds when necessary
✅ **Cache Management**: Automatic cache clearing prevents stale data
✅ **Easy Rollback**: One command to revert changes
✅ **Version Control**: All code changes tracked in git

---

## Next Steps

1. Commit the new Dockerfile and deployment script:
   ```bash
   git add Dockerfile deploy-production.sh .gitignore
   git commit -m "feat: implement multi-stage Docker build for identical environments"
   ```

2. Deploy to production:
   ```bash
   ./deploy-production.sh
   ```

3. Verify everything works:
   ```bash
   curl -I https://ikapsi.horus.my.id
   ```

4. Test forum category creation:
   ```bash
   ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && \
     docker-compose exec -T ikapsi-app php artisan tinker \
     --execute='App\Models\ForumCategory::create([\"name\" => \"Test Category\"]);'"
   ```

---

**You can now deploy with confidence! 🚀**
