# Panduan Setup Firebase — Peta Outlet Swikie

Paket ini berisi versi baru sistem yang datanya tersimpan di **Firebase Firestore**,
bukan lagi di file JSON dalam repo GitHub. Ini menghilangkan masalah "gagal
menyimpan karena bentrok" yang dulu terjadi di GitHub, dan sekarang aman
dipakai puluhan orang (driver, checker gudang, helper) secara bersamaan.

Ikuti langkah-langkah ini SATU KALI SAJA di awal.

---

## Langkah 1 — Buat Project Firebase

1. Buka **console.firebase.google.com**, login dengan akun Google.
2. Klik **Add project** (Tambah project).
3. Beri nama bebas, misalnya `swikie-delivery`.
4. Google Analytics boleh dimatikan (tidak diperlukan) — klik **Create project**.
5. Tunggu sampai selesai dibuat.

## Langkah 2 — Daftarkan Aplikasi Web

1. Di halaman utama project, klik ikon **`</>`** (Web).
2. Beri nickname bebas, misalnya "Swikie App" — **jangan** centang Firebase Hosting.
3. Klik **Register app**.
4. Firebase akan menampilkan kode seperti ini:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "swikie-delivery.firebaseapp.com",
     projectId: "swikie-delivery",
     storageBucket: "swikie-delivery.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```
5. **Salin nilai-nilai ini** — akan dipakai di Langkah 4.
6. Klik **Continue to console**.

## Langkah 3 — Aktifkan Firestore Database

1. Di menu kiri: **Build → Firestore Database**.
2. Klik **Create database**.
3. Pilih lokasi server terdekat, contoh `asia-southeast2` (Jakarta).
4. Pilih mode **Production mode** → **Enable**.
5. Setelah database dibuat, klik tab **Rules** di bagian atas.
6. Hapus semua isi kotak rules, ganti dengan ini:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
7. Klik **Publish**.

   *Penjelasan singkat:* aturan ini artinya "siapa pun yang sudah login (termasuk
   login anonim otomatis dari aplikasi ini) boleh baca & tulis data". Ini sepadan
   dengan cara kerja sistem sebelumnya (siapa pun yang punya link bisa
   memakainya), hanya sekarang jauh lebih andal untuk pemakaian bersamaan.

## Langkah 4 — Aktifkan Login Anonim

Supaya "request.auth != null" di atas bisa terpenuhi tanpa perlu setiap driver
punya akun/password sendiri:

1. Di menu kiri: **Build → Authentication**.
2. Klik **Get started**.
3. Di daftar provider, klik **Anonymous**.
4. Nyalakan toggle **Enable** → **Save**.

## Langkah 5 — Edit File `firebase-config.js`

1. Buka file `firebase-config.js` dari paket ini (bisa pakai Notepad, atau edit
   langsung di GitHub setelah upload — lihat Langkah 6).
2. Ganti bagian ini:
   ```js
   const firebaseConfig = {
     apiKey: "GANTI_DENGAN_API_KEY_ANDA",
     authDomain: "GANTI_PROJECT_ID.firebaseapp.com",
     projectId: "GANTI_PROJECT_ID",
     storageBucket: "GANTI_PROJECT_ID.appspot.com",
     messagingSenderId: "GANTI_SENDER_ID",
     appId: "GANTI_APP_ID"
   };
   ```
   dengan nilai yang Anda salin di Langkah 2. **Hanya file ini yang perlu diedit.**

## Langkah 6 — Upload Semua File ke GitHub

Upload SEMUA isi ZIP ini ke repository GitHub Anda (timpa file lama yang namanya
sama), lewat browser (bukan app GitHub di HP):

```
index.html          ← timpa
admin.html           ← timpa
dashboard.html        ← timpa
muat.html             ← timpa
pengantaran.html      ← timpa
outlets.json          ← timpa (isinya sama, tidak berubah)
firebase-config.js    ← BARU — pastikan sudah diedit dengan config Anda (Langkah 5)
```

**Boleh dihapus dari repo** (sudah tidak dipakai lagi, datanya sekarang di
Firestore): `rencana.json`, `deliveries.json`, `sku_detail.json`,
`muat_check.json`. Tidak wajib dihapus — membiarkannya juga tidak masalah.

## Langkah 7 — Tes

1. Buka `admin.html` versi live — di bagian atas harus muncul kotak hijau
   **"Terhubung ke Firebase"**. Kalau merah, cek lagi isi `firebase-config.js`.
2. Upload invoice, bagi kendaraan, klik **Publikasikan Rencana ke Firebase**.
3. Buka `index.html` — pastikan rencana muncul di mode "Rencana Pengantaran".
4. Coba **Laporkan Terkirim** pada satu outlet — cek muncul di `dashboard.html`.

---

## Apa yang berubah dari versi sebelumnya?

- **Tidak perlu lagi token GitHub** untuk publikasi/laporan — dihapus total.
  Link tim sekarang polos tanpa kode rahasia di baliknya.
- **Tidak ada lagi "gagal simpan karena bentrok"** — setiap laporan (pengantaran,
  cek muat) tersimpan sebagai catatan terpisah, jadi driver A dan driver B bisa
  menyimpan di detik yang sama tanpa saling mengganggu.
- **Update otomatis tanpa refresh** — peta dan halaman muat barang sekarang
  ikut ter-update langsung begitu ada laporan baru dari orang lain.
- **Firestore free tier (Spark)**: gratis sampai ±50.000 pembacaan dan ±20.000
  penulisan data per hari — jauh lebih dari cukup untuk kebutuhan operasional
  harian tim ini.

## Kalau ada error

- **"Firebase belum dikonfigurasi"** → `firebase-config.js` belum diedit dengan
  benar, atau file itu tidak ikut terupload.
- **"Gagal terhubung ke Firebase"** → cek ejaan `projectId` di config, dan
  pastikan Langkah 3 & 4 (Firestore + Login Anonim) sudah aktif.
- **"Missing or insufficient permissions"** → Security Rules di Langkah 3 belum
  ter-publish dengan benar, atau Login Anonim (Langkah 4) belum aktif.
