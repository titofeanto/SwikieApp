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
- **"firebase-config.js gagal dimuat"** → file `firebase-config.js` **harus**
  ada di folder/level yang SAMA dengan `index.html`, `admin.html`, dsb di
  repository GitHub Anda — bukan di dalam subfolder. Cek langsung di GitHub,
  pastikan semua 7 file (5 html + outlets.json + firebase-config.js) muncul
  sejajar di halaman utama repo, bukan salah satunya "tersembunyi" di dalam
  folder lain.
- **"Gagal terhubung ke Firebase"** → cek ejaan `projectId` di config, dan
  pastikan Langkah 3 & 4 (Firestore + Login Anonim) sudah aktif.
- **"Missing or insufficient permissions"** → Security Rules di Langkah 3 belum
  ter-publish dengan benar, atau Login Anonim (Langkah 4) belum aktif.
- Kalau bingung persisnya error apa, buka halaman yang bermasalah di HP →
  sambungkan ke komputer atau buka lewat Chrome desktop → tekan F12 → tab
  **Console** akan menunjukkan pesan error yang lebih detail.

## Password Admin & Dashboard

Password saat ini: **`swikie2026`**

- Peta (`index.html`) punya menu "⋯" di kanan atas → Dashboard & Admin, keduanya
  minta password saat pertama kali diakses.
- Setelah password benar dimasukkan satu kali, Anda bisa berpindah bebas antara
  Admin ↔ Dashboard ↔ Peta tanpa diminta password lagi (selama tab browser
  belum ditutup).
- Kalau ingin ganti password, beri tahu saya password baru yang diinginkan,
  nanti saya generate ulang kode terenkripsinya.

## Cara Memakai Scanner Barcode

Scanner **tidak berdiri sendiri** — ia butuh tahu invoice & SKU mana yang
sedang diperiksa, supaya barcode yang terpindai bisa langsung dicocokkan dan
diisi otomatis. Urutan supaya scanner muncul:

1. Admin publikasikan **Rencana Pengantaran** dulu (dari `admin.html`).
2. Buka `muat.html` → upload Excel **Detail SKU** (kolom Kode SKU diisi nomor
   barcode barang/karton) → klik **Publikasikan Detail SKU ke Firebase**.
3. Setelah itu, kartu-kartu invoice akan muncul di bagian "Daftar Periksa
   Muat Barang" — **setiap kartu invoice punya tombol "📷 Scan Barcode
   untuk Invoice Ini"** sendiri-sendiri.
4. Tekan tombol itu → kamera terbuka → arahkan ke barcode → begitu cocok,
   qty di baris SKU itu otomatis bertambah 1 (dengan getar & tanda ✅).

Kalau kartu invoice tidak muncul sama sekali, itu tandanya rencana atau detail
SKU belum berhasil dipublikasikan/dimuat — cek status koneksi Firebase di
bagian atas halaman.

## Alur Kerja Baru (v2): Satu Sumber Data dari Extract

Mulai versi ini, **satu-satunya sumber data invoice** adalah file extract
"Secondary Sale Data" yang diupload di `admin.html`. Tidak ada lagi upload
terpisah untuk nilai invoice dan detail SKU — semuanya jadi satu langkah.

**Alur harian:**
1. Admin buka `admin.html` → upload file extract dari sistem → klik
   **Publikasikan Data Invoice ke Firebase**.
2. Di tabel "Daftar Invoice", admin pilih status tiap invoice: **Kirim Hari
   Ini** (masuk rencana pengantaran) atau **COD** (perlu diambil terpisah,
   tidak dibagi ke mobil).
3. Klik **Bagi Otomatis ke Kendaraan Aktif** — hanya invoice berstatus "Kirim
   Hari Ini" yang diproses.
4. Klik **Publikasikan Rencana ke Firebase**.
5. Checker gudang buka `muat.html` → pilih invoice dari daftar → di halaman
   detail, cocokkan tiap SKU dengan scan barcode. Kalau barcode yang dipindai
   ternyata ada di invoice LAIN (bukan yang sedang dibuka), sistem otomatis
   memberi tahu dan menawarkan pindah invoice atau tetap di invoice saat ini.
6. Driver buka `index.html` (peta) → tekan outlet → **"🔍 Cek Barang &
   Nilai"** → di sana muncul detail SKU lengkap dengan barcode, harga, dan
   promo. Kalau qty yang diterima outlet berbeda dari qty invoice, nilai akhir
   otomatis terkoreksi (termasuk promo yang ikut dikembalikan secara
   proporsional) — tinggal salin nilai akhirnya untuk dikonfirmasi ke PDA
   outlet (misalnya Alfamart).
7. Admin pantau semuanya di `dashboard.html`, termasuk export Excel lengkap.

**Duplikat otomatis ditimpa:** kalau file extract diupload ulang (misalnya
ada revisi), baris dengan No Invoice + Kode SKU yang sama akan menimpa data
lama; baris baru akan ditambahkan. Tidak akan terjadi data dobel.


File baru `sku_master.json` berisi 19.519 SKU dari Product Hierarchy Anda,
memetakan **barcode produk satuan (PC)** maupun **barcode karton/outer (CS)**
ke Kode SKU aslinya (lebih dari 43.000 kombinasi barcode).

Manfaatnya: saat checker memindai barcode apa pun yang tertempel di kardus
(baik barcode karton besar maupun barcode kemasan satuan), sistem otomatis
menerjemahkannya ke Kode SKU yang sama dan mencocokkan ke baris invoice yang
tepat — checker tidak perlu tahu/pilih jenis barcode mana yang dipindai.

File ini murni referensi statis (tidak berubah-ubah), jadi tidak perlu masuk
ke Firebase — cukup diupload sebagai file biasa ke GitHub bersama file lain.

