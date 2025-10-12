# 🚀 Deployment Guide - iKAPSI UHO

## 📋 Deployment Workflow (Safe & Simple)

### **Step 1: Make Changes Locally**
```bash
# Work on your code
# Test everything locally first!
composer run dev
```

### **Step 2: Commit Your Changes**
```bash
# Stage your changes
git add .

# Commit with a clear message
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve bug in forum"
```

### **Step 3: Deploy to Production**
```bash
# This will automatically:
# 1. Push to GitHub
# 2. Pull on server
# 3. Install dependencies (if needed)
# 4. Run migrations
# 5. Clear & rebuild caches
# 6. Restart containers
# 7. Verify deployment
./deploy-production.sh
```

**That's it!** 🎉 The script handles everything safely.

---

## 🆘 Emergency Rollback

If something goes wrong after deployment:

```bash
# Rollback to previous commit
./rollback-production.sh

# Or rollback to specific commit
./rollback-production.sh abc123

# Or rollback 2 commits back
./rollback-production.sh HEAD~2
```

---

## 🔧 Manual Deployment Steps (Advanced)

If you need to deploy manually or troubleshoot:

### **Connect to Production Server**
```bash
ssh admin@147.93.81.147
cd ~/Documents/ikapsiUHO
```

### **Pull Latest Changes**
```bash
git pull origin main
```

### **Update Dependencies** (only if composer.lock or package.json changed)
```bash
# PHP dependencies
docker-compose exec -T ikapsi-app composer install --no-dev --optimize-autoloader

# JavaScript dependencies & build
docker-compose exec -T ikapsi-app bash -c 'export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH" && bun install && bun run build'
```

### **Run Migrations**
```bash
docker-compose exec -T ikapsi-app php artisan migrate --force
```

### **Clear & Rebuild Caches** (IMPORTANT!)
```bash
# Clear everything first
docker-compose exec -T ikapsi-app php artisan cache:clear
docker-compose exec -T ikapsi-app php artisan config:clear
docker-compose exec -T ikapsi-app php artisan route:clear
docker-compose exec -T ikapsi-app php artisan view:clear

# Rebuild optimized caches
docker-compose exec -T ikapsi-app php artisan config:cache
docker-compose exec -T ikapsi-app php artisan route:cache
docker-compose exec -T ikapsi-app php artisan view:cache
```

### **Restart Application**
```bash
docker-compose restart ikapsi-app
```

### **Verify Deployment**
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs --tail=50 ikapsi-app

# Test app directly
docker-compose exec -T ikapsi-app curl -I http://localhost

# Test public URL
curl -I https://ikapsi.horus.my.id
```

---

## 🔍 Troubleshooting

### **502 Bad Gateway**
```bash
# Clear all caches
docker-compose exec -T ikapsi-app php artisan cache:clear
docker-compose exec -T ikapsi-app php artisan config:clear
docker-compose exec -T ikapsi-app php artisan route:clear
docker-compose exec -T ikapsi-app php artisan view:clear

# Rebuild caches
docker-compose exec -T ikapsi-app php artisan config:cache
docker-compose exec -T ikapsi-app php artisan route:cache

# Restart
docker-compose restart ikapsi-app
```

### **500 Internal Server Error**
```bash
# Check logs
docker-compose logs --tail=100 ikapsi-app
docker-compose exec -T ikapsi-app tail -50 storage/logs/laravel.log

# Check permissions
docker-compose exec -T ikapsi-app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec -T ikapsi-app chmod -R 775 storage bootstrap/cache
```

### **Database Issues**
```bash
# Check database connection
docker-compose exec -T ikapsi-app php artisan tinker --execute="DB::connection()->getPdo();"

# Check migrations status
docker-compose exec -T ikapsi-app php artisan migrate:status

# Rollback last migration
docker-compose exec -T ikapsi-app php artisan migrate:rollback

# Re-run migrations
docker-compose exec -T ikapsi-app php artisan migrate
```

### **Container Won't Start**
```bash
# Check container logs
docker-compose logs ikapsi-app

# Rebuild container
docker-compose down
docker-compose build --no-cache ikapsi-app
docker-compose up -d

# Check health
docker-compose ps
```

---

## 📊 Monitoring

### **Check Application Status**
```bash
ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && docker-compose ps"
```

### **View Live Logs**
```bash
ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && docker-compose logs -f ikapsi-app"
```

### **Check Disk Space**
```bash
ssh admin@147.93.81.147 "df -h"
```

### **Check Memory Usage**
```bash
ssh admin@147.93.81.147 "free -h"
```

---

## ⚡ Quick Commands Reference

| Command | Description |
|---------|-------------|
| `./deploy-production.sh` | Deploy to production |
| `./rollback-production.sh` | Rollback to previous version |
| `ssh admin@147.93.81.147` | Connect to server |
| `docker-compose ps` | Check containers status |
| `docker-compose logs -f ikapsi-app` | View live logs |
| `docker-compose restart ikapsi-app` | Restart app |
| `docker-compose down` | Stop all containers |
| `docker-compose up -d` | Start all containers |

---

## 🛡️ Safety Checklist

Before deploying to production:

- [ ] ✅ All changes tested locally
- [ ] ✅ All tests passing (`composer run test`)
- [ ] ✅ No uncommitted changes
- [ ] ✅ Database migrations tested
- [ ] ✅ Environment variables checked
- [ ] ✅ Backup recent if making major changes

---

## 📝 Important Notes

1. **Always test locally first** before deploying to production
2. **The deployment script automatically clears caches** to prevent stale cache issues
3. **Rollback script is available** for emergencies
4. **Database backups** are recommended before major changes
5. **Monitor logs** after deployment to catch issues early

---

## 🔐 Production Server Access

- **SSH**: `ssh admin@147.93.81.147`
- **Website**: https://ikapsi.horus.my.id
- **Admin Panel**: https://ikapsi.horus.my.id/admin
- **Database**: MySQL 8.0 (accessible via phpMyAdmin)

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs: `docker-compose logs ikapsi-app`
3. Use rollback if needed: `./rollback-production.sh`
4. Contact system administrator

---

**Last Updated**: October 12, 2025
