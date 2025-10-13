# 🚀 Deployment Guide - iKAPSI UHO

## Deployment ke Production

### 1. Deployment Normal (Cepat - Tanpa Rebuild)

```bash
./deploy-production.sh
```

**Apa yang dilakukan:**

- ✅ Build frontend assets (Vite)
- ✅ Push ke GitHub
- ✅ Pull perubahan di VPS
- ✅ Run database migrations
- ✅ Generate Wayfinder routes
- ✅ Clear & rebuild cache (config, route, view)
- ✅ Restart container
- ⏱️ **Waktu: ~1-2 menit**

**Gunakan untuk:**

- Perubahan frontend (React/TypeScript)
- Perubahan view/blade
- Perubahan migration baru
- Perubahan kecil yang tidak butuh rebuild

---

### 2. Deployment dengan Rebuild (Force Rebuild Docker)

```bash
./deploy-production.sh --rebuild
```

**Apa yang dilakukan:**

- ✅ Semua step deployment normal
- ✅ **Force rebuild Docker image** (code terbaru masuk ke container)
- ✅ Recreate container dari awal
- ⏱️ **Waktu: ~5-10 menit**

**⚠️ WAJIB gunakan `--rebuild` jika ada perubahan di:**

- ✅ Controller (`app/Http/Controllers/**`)
- ✅ Service (`app/Services/**`)
- ✅ Model (`app/Models/**`)
- ✅ Middleware (`app/Http/Middleware/**`)
- ✅ Request Validation (`app/Http/Requests/**`)
- ✅ Config files (`config/**`)
- ✅ Routes (`routes/**`)
- ✅ Semua PHP code di `app/` folder

**Contoh kasus yang butuh `--rebuild`:**

```bash
# Setelah fix bug di UserController
./deploy-production.sh --rebuild

# Setelah tambah validation baru di ForumRequest
./deploy-production.sh --rebuild

# Setelah ubah config fortify.php
./deploy-production.sh --rebuild
```

---

### 3. Auto-Rebuild (Tanpa Flag)

Script akan **otomatis rebuild** jika mendeteksi perubahan di:

- `Dockerfile`
- `docker-compose.yml`
- `docker-entrypoint.sh`
- `docker/supervisord.conf`
- `app/Providers/*`
- `app/Observers/*`

Tidak perlu pakai flag `--rebuild` untuk file-file ini.

---

## Rollback (Emergency)

Jika terjadi masalah setelah deployment:

```bash
./rollback-production.sh
```

Script akan:

- ✅ Tampilkan 5 commit terakhir
- ✅ Pilih commit yang mau di-rollback
- ✅ Fix permission storage/ (untuk git reset)
- ✅ Reset ke commit terpilih
- ✅ Rebuild Docker image
- ✅ Clear cache
- ✅ Restart container

---

## Troubleshooting

### Website 502 Bad Gateway setelah deployment

```bash
# Cek status container
ssh admin@147.93.81.147
cd ~/Documents/ikapsiUHO
docker-compose ps

# Cek logs
docker-compose logs --tail=50 ikapsi-app

# Restart container
docker-compose restart ikapsi-app
```

### Code baru tidak aktif (masih code lama)

```bash
# Deploy ulang dengan rebuild
./deploy-production.sh --rebuild
```

### Queue worker tidak jalan

```bash
# Cek status supervisor
ssh admin@147.93.81.147
cd ~/Documents/ikapsiUHO
docker-compose exec ikapsi-app ps aux | grep "queue:work"

# Seharusnya ada 2 worker running
```

### Permission error saat rollback

```bash
# Rollback script sudah auto-fix permission
# Tapi jika masih error, manual fix:
ssh admin@147.93.81.147
cd ~/Documents/ikapsiUHO
sudo chown -R admin:admin storage/
sudo chmod -R 775 storage/
git reset --hard <commit-hash>
```

---

## Quick Commands

```bash
# Deploy cepat (frontend only)
./deploy-production.sh

# Deploy dengan rebuild (backend changes)
./deploy-production.sh --rebuild

# Rollback
./rollback-production.sh

# Cek status production
ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && docker-compose ps"

# Cek logs production
ssh admin@147.93.81.147 "cd ~/Documents/ikapsiUHO && docker-compose logs --tail=50 ikapsi-app"

# Test website
curl -I https://ikapsi.horus.my.id
```

---

## Supervisor Status Check

```bash
ssh admin@147.93.81.147
cd ~/Documents/ikapsiUHO
docker-compose exec ikapsi-app ps aux | grep -E "apache2|queue:work|schedule:run"
```

**Expected output:**

- ✅ Apache2 running (multiple processes)
- ✅ 2x queue:work processes
- ✅ 1x schedule:run process

---

## Production Server Info

- **VPS:** admin@147.93.81.147
- **Path:** ~/Documents/ikapsiUHO
- **URL:** <https://ikapsi.horus.my.id>
- **Admin:** <admin@ikapsiuho.id> / password
- **Database:** MySQL 8.0 (Docker)
- **Queue:** Database driver
- **Scheduler:** Cron setiap menit (Supervisor)
