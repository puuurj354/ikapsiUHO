# Environment Parity - Quick Start

## What Changed?

✅ **Local and production environments are now 100% identical**

### The Problem We Fixed

- Production had 500 errors from missing `public/build/manifest.json`
- No build tools (bun/node) in production Docker container
- Deployment was broken and unreliable

### The Solution

**We now commit build artifacts to git** (industry-standard approach)

```bash
# Build once locally
bun run build

# Commit to git
git add public/build
git commit -m "Update build"

# Deploy everywhere
./deploy-production.sh
```

---

## Daily Workflow

### 1. Make Changes

```bash
# Edit your code
vim app/Http/Controllers/ForumController.php
```

### 2. Build Assets (if frontend changed)

```bash
bun run build
```

### 3. Commit & Deploy

```bash
git add .
git commit -m "feat: your changes"
./deploy-production.sh
```

**That's it!** No manual rsync, no Docker builds, no hassle.

---

## What's Different Now?

| Before                        | After                        |
| ----------------------------- | ---------------------------- |
| ❌ `public/build/` gitignored | ✅ `public/build/` committed |
| ❌ Manual asset copying       | ✅ Automatic via git         |
| ❌ 500 errors in production   | ✅ Always works              |
| ❌ Different environments     | ✅ 100% identical            |

---

## Key Files

- **`deploy-production.sh`** - Builds assets, deploys safely
- **`pre-commit.sh`** - Optional auto-build hook
- **`COMPLETE-SETUP-GUIDE.md`** - Full documentation
- **`ENVIRONMENT-SYNC.md`** - Technical details

---

## Emergency Procedures

### If deployment fails

```bash
./rollback-production.sh
```

### If site shows 500 error

```bash
ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && \
  docker-compose exec -T ikapsi-app php artisan optimize:clear && \
  docker-compose restart ikapsi-app"
```

### If Observer not working

```bash
ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && \
  docker-compose down && docker-compose up -d --build"
```

---

## Verify Everything Works

```bash
# 1. Build locally
bun run build

# 2. Check build files exist
ls -la public/build/manifest.json

# 3. Commit
git add . && git commit -m "test: verify environment parity"

# 4. Deploy
./deploy-production.sh

# 5. Check production
curl -I https://ikapsi.horus.my.id
# Should return: HTTP/1.1 200 OK
```

---

## Benefits

✅ **Fast Deployments** - Just `git pull` (no build step)  
✅ **Reliable** - Same assets every time  
✅ **Simple** - No complex Docker builds  
✅ **Safe** - Automatic health checks  
✅ **Reproducible** - Committed to git

---

## Next Steps

1. **Read full guide**: `COMPLETE-SETUP-GUIDE.md`
2. **Optional**: Install pre-commit hook: `cp pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`
3. **Deploy**: Run `./deploy-production.sh`

**You can now deploy with confidence! 🚀**
