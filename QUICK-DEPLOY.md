# 🚀 Quick Deploy Guide

## Deploy Perubahan Lokal ke Production dalam 3 Langkah

### 1️⃣ Push ke GitHub
```bash
# Di komputer lokal
cd /home/purnama/Documents/ikapsiUHO
git add .
git commit -m "feat: deskripsi perubahan"
git push origin adjust-2
```

### 2️⃣ Merge ke Main (jika perlu)
```bash
git checkout main
git merge adjust-2
git push origin main
```

**ATAU** buat Pull Request di GitHub.

### 3️⃣ Deploy ke VPS
```bash
ssh admin@147.93.81.147 'cd ~/Documents/ikapsiUHO && ./deploy.sh'
```

---

## ✅ Deployment Berhasil!

Script otomatis akan:
- Fetch perubahan dari GitHub
- Update code (app/, resources/, routes/, config/)
- Install dependencies baru (jika ada)
- Rebuild frontend (jika perlu)
- Jalankan migrasi database
- Clear dan optimize cache
- Restart container

**Website:** <https://ikapsi.horus.my.id>

---

## 📖 Dokumentasi Lengkap

Lihat [DEPLOYMENT-WORKFLOW.md](./DEPLOYMENT-WORKFLOW.md) untuk:
- Penjelasan detail setiap langkah
- Troubleshooting
- Best practices
- Backup database
- Monitor logs

---

## 🎯 Test Deployment

Setelah deploy, verifikasi:
1. Buka website: <https://ikapsi.horus.my.id>
2. Check container: `docker-compose ps`
3. Monitor logs: `docker-compose logs -f ikapsi-app`

---

## ⚡ One-Liner (Advanced)

Deploy langsung tanpa SSH interaktif:
```bash
# Dari komputer lokal (setelah push ke GitHub)
ssh admin@147.93.81.147 'cd ~/Documents/ikapsiUHO && ./deploy.sh'
```

---

**Last Updated:** 11 Oktober 2025  
**VPS:** 147.93.81.147  
**Project:** iKAPSI UHO
