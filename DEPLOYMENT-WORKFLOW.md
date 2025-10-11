# Workflow Deployment iKAPSI UHO ke Production

## 🚀 Cara Deploy Perubahan Lokal ke Production

### 1️⃣ **Push Perubahan Lokal ke GitHub**

Dari komputer lokal (branch `adjust-2` atau branch apapun):

```bash
# Pastikan semua perubahan sudah di-commit
git status

# Push ke GitHub
git push origin adjust-2
```

### 2️⃣ **Merge ke Branch Main di GitHub** (Opsional)

Jika ingin perubahan masuk ke branch `main`:

```bash
# Checkout ke main
git checkout main

# Merge dari adjust-2
git merge adjust-2

# Push ke GitHub
git push origin main
```

**ATAU** gunakan Pull Request di GitHub (lebih aman).

### 3️⃣ **Deploy ke Production VPS**

SSH ke VPS dan jalankan deployment script:

```bash
# SSH ke VPS
ssh admin@147.93.81.147

# Masuk ke directory project
cd ~/Documents/ikapsiUHO

# Jalankan deployment script
./deploy.sh
```

Script akan otomatis:
- ✅ Fetch perubahan terbaru dari GitHub (branch `main`)
- ✅ Pull code terbaru (app/, resources/, routes/, config/, dll)
- ✅ Install dependencies jika ada perubahan composer.json/package.json
- ✅ Rebuild frontend jika perlu
- ✅ Jalankan migrasi database
- ✅ Clear dan optimize cache
- ✅ Restart container

### 4️⃣ **Verifikasi Deployment**

Cek website:
- 🌐 https://ikapsi.horus.my.id

Cek container status:
```bash
docker-compose ps
```

Cek logs jika ada error:
```bash
docker-compose logs -f ikapsi-app
```

---

## 📋 Deployment Script Details

**File:** `~/Documents/ikapsiUHO/deploy.sh`

Script ini menggunakan **strategi Git sparse checkout** untuk menghindari konflik dengan file `storage/` yang di-generate oleh Docker.

**Yang di-pull dari GitHub:**
- ✅ `app/` - Backend code (Controllers, Models, Services)
- ✅ `resources/` - Frontend code (React, CSS)
- ✅ `routes/` - Route definitions
- ✅ `database/` - Migrations, seeders
- ✅ `config/` - Configuration files
- ✅ `composer.json` - PHP dependencies
- ✅ `package.json` - JS dependencies

**Yang TIDAK di-pull (ignored):**
- ❌ `storage/` - Runtime files (logs, cache, uploaded files)
- ❌ `.env` - Production environment config
- ❌ `public/hot` - Vite dev mode indicator

---

## 🔄 Quick Deployment Cheatsheet

### Deploy dari Branch `adjust-2`

```bash
# 1. Di lokal: push perubahan
git push origin adjust-2

# 2. Di lokal: merge ke main
git checkout main
git merge adjust-2
git push origin main

# 3. Di VPS: deploy
ssh admin@147.93.81.147 'cd ~/Documents/ikapsiUHO && ./deploy.sh'
```

### Deploy Langsung Tanpa Merge ke Main

Edit script `deploy.sh` di VPS, ganti:
```bash
git checkout origin/main -- app/ resources/ routes/ database/ config/ composer.json package.json
```

Menjadi:
```bash
git checkout origin/adjust-2 -- app/ resources/ routes/ database/ config/ composer.json package.json
```

---

## 🛠️ Troubleshooting

### Problem: "Nothing changed after deployment"

**Solution:** Clear browser cache atau test dengan incognito mode.

### Problem: "500 Internal Server Error"

**Solution:** Check logs:
```bash
docker-compose logs -f ikapsi-app
```

Clear cache:
```bash
docker-compose exec ikapsi-app php artisan optimize:clear
docker-compose exec ikapsi-app php artisan config:cache
```

### Problem: "Database migration error"

**Solution:** Rollback dan retry:
```bash
docker-compose exec ikapsi-app php artisan migrate:rollback
docker-compose exec ikapsi-app php artisan migrate --force
```

### Problem: "Permission denied on storage files"

**Solution:** Ini normal! Script menggunakan sparse checkout untuk menghindari masalah ini. Storage files tetap milik Docker container dan tidak di-touch oleh Git.

---

## 📝 Notes

- **Branch Production:** VPS menggunakan branch `master` lokal yang track ke `origin/main`
- **Storage:** File di `storage/` milik Docker container (user www-data), tidak di-manage oleh Git
- **Environment:** `.env` di production adalah `.env.production` yang sudah di-symlink
- **Database:** MySQL di container `ikapsi-db`, data persistent di Docker volume
- **SSL Certificates:** Managed by Nginx Proxy Manager, auto-renew

---

## 🎯 Best Practices

1. **Selalu commit perubahan sebelum deploy**
2. **Test di lokal dulu dengan `composer run dev`**
3. **Gunakan Pull Request untuk review code sebelum merge ke main**
4. **Backup database sebelum migrasi besar:**
   ```bash
   docker-compose exec ikapsi-db mysqldump -u ikapsi_user -p ikapsi_db > backup.sql
   ```
5. **Monitor logs setelah deployment:**
   ```bash
   docker-compose logs -f
   ```

---

## 📞 Support

- VPS: 147.93.81.147
- Domain: https://ikapsi.horus.my.id
- GitHub: https://github.com/puuurj354/ikapsiUHO
- Docker Containers: `ikapsi-app`, `ikapsi-db`
- Nginx Proxy Manager: http://147.93.81.147:81
