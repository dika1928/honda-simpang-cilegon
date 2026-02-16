# 🏍️ Honda Simpang Digital Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/f25289a3-be72-43ba-9694-d588de094bbf/deploy-status)](https://app.netlify.com/projects/comfy-mousse-049c07/deploys)
[![Security: Secure Coding](https://img.shields.io/badge/Security-Hardened-success.svg)](#)

Platform digital khusus untuk **Honda Simpang Cilegon**. Dibangun dengan arsitektur modern yang mengutamakan kecepatan, kemudahan pengelolaan konten, dan keamanan data tingkat tinggi.

## 🛡️ Security Features
- **Strict Content Security Policy (CSP)**: Mencegah serangan XSS.
- **Anti-Clickjacking**: Menggunakan header keamanan `X-Frame-Options`.
- **Permissions Policy**: Membatasi akses fitur browser (kamera/mik) yang tidak diperlukan.
- **Environment Isolation**: Pemisahan variabel sensitif menggunakan `.env`.

## 📂 Project Structure
- `public/`: Antarmuka pengunjung (Frontend).
- `core/`: Logika keamanan dan manajemen data.
- `admin/`: Panel kendali konten (CMS).
- `data/`: Penyimpanan data motor dan promo (JSON).

## 🚀 Development
1. Clone repositori ini.
2. Pastikan file `.env` sudah dikonfigurasi berdasarkan `.env.example`.
3. Jalankan `npm install` untuk sinkronisasi dependensi.

---
© 2026 Honda Simpang Digital Platform | Arsitek: Andika Rendi Prakarsa
