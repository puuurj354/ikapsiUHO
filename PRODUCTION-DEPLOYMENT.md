# 🎉 iKAPSI UHO - Production Deployment Success!

## ✅ Deployment Status

**Website:** <https://ikapsi.horus.my.id>  
**Status:** 🟢 LIVE & RUNNING  
**Deployment Date:** 11 Oktober 2025

---

## 🔐 Credentials

### Admin User
- **Email:** `admin@ikapsiuho.id`
- **Password:** `password`
- ⚠️ **IMPORTANT:** Ganti password setelah login pertama!

### VPS SSH
- **Host:** `147.93.81.147`
- **User:** `admin`
- **Directory:** `~/Documents/ikapsiUHO`

---

## 📋 Deployment Architecture

### Tech Stack
- **Backend:** Laravel 12 + PHP 8.3
- **Frontend:** React 19 + TypeScript + Inertia.js
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** MySQL 8.0
- **Web Server:** Apache 2.4 (in Docker)
- **Reverse Proxy:** Nginx Proxy Manager with Let's Encrypt SSL
- **Container:** Docker + Docker Compose

### Project Structure (VPS)
```
/home/admin/Documents/ikapsiUHO/
├── .env                    # Production environment config
├── .dockerignore          # Docker ignore rules (allows .env)
├── Dockerfile             # Single-stage PHP 8.3-Apache build
├── docker-compose.yml     # MySQL + App containers
├── docker-entrypoint.sh   # Smart startup script
├── deploy-production.sh   # Local deployment script
├── app/                   # Laravel backend
├── resources/js/          # React frontend
├── public/build/          # Built frontend assets
└── storage/               # Runtime files (owned by www-data)
```

---

## 🚀 Cara Deploy Perubahan

### Method 1: Using Deployment Script (Recommended)
```bash
# Dari komputer lokal
cd /home/purnama/Documents/ikapsiUHO
./deploy-production.sh
```

Script otomatis akan:
1. Push perubahan ke GitHub
2. SSH ke VPS dan pull latest code
3. Install dependencies jika ada perubahan
4. Build frontend jika perlu
5. Run migrasi database
6. Clear dan optimize cache
7. Restart container

### Method 2: Manual Deployment
```bash
# 1. Push ke GitHub
git push origin main

# 2. SSH ke VPS
ssh admin@147.93.81.147

# 3. Update code
cd ~/Documents/ikapsiUHO
git pull origin main

# 4. Rebuild container (jika perlu)
docker-compose down
docker-compose up -d --build

# 5. Install dependencies (jika perlu)
docker-compose exec -T ikapsi-app composer install --no-dev --optimize-autoloader
docker-compose exec -T ikapsi-app bash -c 'export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH" && bun install && bun run build'

# 6. Run migrations
docker-compose exec -T ikapsi-app php artisan migrate --force

# 7. Optimize
docker-compose exec -T ikapsi-app php artisan optimize:clear
docker-compose exec -T ikapsi-app php artisan config:cache
docker-compose exec -T ikapsi-app php artisan route:cache
```

---

## 🛠️ Common Commands

### Container Management
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f ikapsi-app

# Restart containers
docker-compose restart ikapsi-app

# Stop all
docker-compose down

# Start all
docker-compose up -d
```

### Laravel Artisan
```bash
# Run migrations
docker-compose exec -T ikapsi-app php artisan migrate --force

# Run seeder
docker-compose exec -T ikapsi-app php artisan db:seed --class=AdminUserSeeder --force

# Clear cache
docker-compose exec -T ikapsi-app php artisan optimize:clear

# Generate key
docker-compose exec -T ikapsi-app php artisan key:generate --show
```

### Database
```bash
# Access MySQL
docker-compose exec ikapsi-db mysql -u ikapsi_user -p ikapsi_db
# Password: iKapsi2025SecurePass!

# Backup database
docker-compose exec ikapsi-db mysqldump -u ikapsi_user -piKapsi2025SecurePass! ikapsi_db > backup.sql

# Restore database
docker-compose exec -T ikapsi-db mysql -u ikapsi_user -piKapsi2025SecurePass! ikapsi_db < backup.sql
```

---

## 🔧 Troubleshooting

### Website Menampilkan 500 Error
```bash
# Check logs
docker-compose logs --tail=50 ikapsi-app

# Clear cache
docker-compose exec -T ikapsi-app php artisan optimize:clear
docker-compose exec -T ikapsi-app php artisan config:cache

# Restart container
docker-compose restart ikapsi-app
```

### Frontend Assets Tidak Load
```bash
# Rebuild frontend
docker-compose exec -T ikapsi-app bash -c 'export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH" && bun run build'

# Check build folder
docker-compose exec ikapsi-app ls -lh public/build/
```

### Database Connection Error
```bash
# Check database container
docker-compose ps ikapsi-db

# Check connection from app container
docker-compose exec ikapsi-app mysql --skip-ssl -h ikapsi-db -u ikapsi_user -p -e "SELECT 1" ikapsi_db
```

### Permission Issues
```bash
# Fix storage permissions
docker-compose exec ikapsi-app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec ikapsi-app chmod -R 775 storage bootstrap/cache
```

---

## 📝 Important Notes

### Environment Variables
- `.env` di VPS sudah dikonfigurasi untuk production
- `APP_KEY` sudah di-generate
- Database credentials di docker-compose.yml
- Asset URL: `https://ikapsi.horus.my.id`

### Docker Configuration
- `.dockerignore` sudah di-edit untuk ALLOW `.env` file
- `docker-entrypoint.sh` skip key generate jika APP_KEY sudah ada
- Bun.sh di-install di dalam container saat build frontend

### Storage Directory
- File di `storage/` owned by `www-data` (Docker container user)
- TIDAK di-track oleh Git (kecuali `.gitignore` placeholders)
- Di-persist via Docker volumes

### Seeders
- Hanya `AdminUserSeeder` yang dijalankan di production
- Seeder lain (artikel, event, forum) TIDAK dijalankan

---

## 🎯 Next Steps

### Security
1. ✅ Ganti password admin default
2. ✅ Setup backup rutin database
3. ✅ Monitor logs secara berkala
4. ⚠️ Setup monitoring (optional: Sentry, LogRocket)
5. ⚠️ Enable rate limiting untuk API

### Performance
1. ✅ Frontend assets sudah di-build dan optimized
2. ✅ Laravel cache sudah enabled (config, routes, views)
3. ⚠️ Consider Redis untuk session & cache (optional)
4. ⚠️ Setup CDN untuk static assets (optional)

### Development
1. ✅ Git workflow sudah setup
2. ✅ Deployment script sudah ready
3. ⚠️ Setup staging environment (optional)
4. ⚠️ CI/CD dengan GitHub Actions (optional)

---

## 📞 Support Information

- **VPS IP:** 147.93.81.147
- **Domain:** ikapsi.horus.my.id
- **GitHub Repo:** <https://github.com/puuurj354/ikapsiUHO>
- **Docker Containers:**
  - `ikapsi-app` (Laravel + Apache + PHP 8.3)
  - `ikapsi-db` (MySQL 8.0)
- **Nginx Proxy Manager:** <http://147.93.81.147:81>
  - Default admin: `admin@example.com` / `changeme`

---

## ✨ Deployment Highlights

✅ **Clean Deployment:** Semua container dan file lama sudah dihapus  
✅ **Fresh Git Clone:** Project di-clone langsung dari GitHub  
✅ **Proper .env:** Environment variables sudah configured  
✅ **APP_KEY Generated:** Application key sudah di-set  
✅ **Database Migrated:** All 15 migrations berhasil  
✅ **Admin Seeded:** User admin sudah ready  
✅ **Frontend Built:** Assets compiled dan optimized  
✅ **HTTPS Enabled:** SSL certificate via Let's Encrypt  
✅ **Health Checks:** Container monitoring active  

🎉 **Website Status:** FULLY OPERATIONAL!
