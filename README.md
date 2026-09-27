# Announcer Stasiun Ketapang

Aplikasi Sistem Pengumuman Terpadu Stasiun Ketapang dengan Bel Ding Dong & Suara TTS AI (Gemini TTS / Bahasa Indonesia).

## Cara Deploy ke Render.com (Gratis)

Render.com mendukung backend Node.js (Web Service) secara penuh di tier gratis, sehingga fitur TTS dan audio backend akan berjalan 100% persis seperti di preview AI Studio.

### Langkah-langkah Publish ke Render:

1. **Pastikan Kode Sudah Masuk ke GitHub Repository Anda**
   - Push commit terbaru dari project ini ke akun GitHub Anda.

2. **Login ke Render.com**
   - Buka [dashboard.render.com](https://dashboard.render.com/) dan login menggunakan akun Render Anda (bisa langsung Sign In with GitHub).

3. **Buat Web Service Baru**
   - Klik tombol **"New +"** di pojok kanan atas, lalu pilih **"Web Service"**.
   - Pilih opsi **"Build and deploy from a Git repository"** dan klik **Next**.
   - Hubungkan / pilih repository GitHub `announcer-ktg` (atau nama repo Anda).

4. **Konfigurasi Web Service**
   - **Name**: `announcer-ketapang` (atau sesuai keinginan Anda)
   - **Region**: Singapore (Southeast Asia) atau Oregon (pilih yang terdekat)
   - **Branch**: `main` (atau `master`)
   - **Root Directory**: biarkan kosong
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: Pilih **Free** ($0/month)

5. **Tambahkan Environment Variable (Opsional tapi Direkomendasikan)**
   - Gulir ke bagian **Environment Variables**.
   - Tambahkan:
     - Key: `GEMINI_API_KEY`
     - Value: Masukkan API Key Gemini Anda dari Google AI Studio (jika ingin suara AI Gemini).
   - *Catatan: Jika tidak diisi, server tetap akan bersuara menggunakan fallback audio suara Bahasa Indonesia otomatis.*

6. **Klik "Deploy Web Service"**
   - Render akan otomatis melakukan build dan menjalankan aplikasi.
   - Setelah selesai (status: *Live*), Anda akan mendapatkan URL publik gratis seperti:
     `https://announcer-ketapang.onrender.com`
   - Buka URL tersebut di browser, dan suara TTS beserta bel stasiun akan berbunyi persis seperti di AI Studio!

---

### Jika Diminta "Add Card" di Render:
1. **Periksa pilihan paket**: Pastikan pada bagian **Instance Type** Anda memilih opsi **Free ($0/month)**, bukan Starter ($7/month).
2. Jika Render tetap meminta kartu (kebijakan verifikasi akun baru), Anda tidak perlu khawatir karena ada pilihan hosting di bawah ini yang **100% GRATIS TANPA PERLU KARTU KREDIT/DEBIT**.

---

## Pilihan Alternatif: Vercel (100% Gratis & Tanpa Kartu Kredit)
Project ini sudah dilengkapi konfigurasi `vercel.json` dan otomatis kompatibel dengan Vercel:
1. Buka [vercel.com](https://vercel.com/) dan login menggunakan akun GitHub Anda.
2. Klik **"Add New..."** ➔ **"Project"**.
3. Pilih repository GitHub Anda (`announcer-ktg`), lalu klik **"Import"**.
4. Di bagian *Environment Variables*, tambahkan `GEMINI_API_KEY` (opsional jika ada).
5. Klik tombol **"Deploy"**. Selesai dalam 30 detik!

---

## Pilihan Alternatif: Glitch.com (100% Gratis & Tanpa Kartu Kredit)
1. Buka [glitch.com](https://glitch.com/) dan login menggunakan GitHub.
2. Klik **"New Project"** (kanan atas) ➔ **"Import from GitHub"**.
3. Masukkan link repositori GitHub Anda.
4. Aplikasi langsung berjalan otomatis!
