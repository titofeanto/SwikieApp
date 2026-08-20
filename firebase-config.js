/* ============================================================
   KONFIGURASI FIREBASE — GANTI NILAI DI BAWAH INI
   ============================================================
   Ambil dari Firebase Console:
   Project Settings (ikon gerigi) → General → scroll ke "Your apps"
   → pilih app web Anda → salin objek firebaseConfig persis di sini.

   Nilai-nilai ini AMAN ditaruh di kode (bukan rahasia seperti
   password/token) — keamanan sesungguhnya diatur lewat Firestore
   Security Rules di Firebase Console, bukan dengan menyembunyikan
   nilai-nilai ini.
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyA6g9q_Eq0jN91L91EeqNJ99OMDBEkNVLE",
  authDomain: "swikie-operasional.firebaseapp.com",
  projectId: "swikie-operasional",
  storageBucket: "swikie-operasional.firebasestorage.app",
  messagingSenderId: "586748479988",
  appId: "1:586748479988:web:37c11cbffc2e55b04e51a1"
};

/* ============================================================
   Jangan ubah apa pun di bawah baris ini.

   Semua langkah di bawah dibungkus try/catch dengan sengaja:
   kalau ADA yang salah (SDK Firebase gagal dimuat, config keliru,
   dsb), halaman TETAP HARUS bisa jalan — cukup fitur yang butuh
   Firebase saja yang nonaktif, bukan seluruh halaman ikut macet.
   ============================================================ */
function showFirebaseWarning(msg) {
  const render = () => {
    if (document.querySelector('.__fb_warning_banner')) return; // jangan dobel
    const banner = document.createElement('div');
    banner.className = '__fb_warning_banner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#C64B3C;color:#fff;padding:10px 16px;font-family:system-ui,sans-serif;font-size:13px;font-weight:600;text-align:center;';
    banner.textContent = '⚠️ ' + msg;
    document.body.prepend(banner);
  };
  if (document.body) render();
  else window.addEventListener('DOMContentLoaded', render);
}

/* Helper: Firestore document IDs tidak boleh mengandung "/" */
function sanitizeDocId(str) {
  return String(str == null ? 'unknown' : str).trim().replace(/\//g, '_').slice(0, 400) || 'unknown';
}

const FIREBASE_CONFIGURED = firebaseConfig.apiKey !== "GANTI_DENGAN_API_KEY_ANDA";

let db = null;
let firebaseReady = Promise.resolve(false);

if (!FIREBASE_CONFIGURED) {
  console.warn('Firebase belum dikonfigurasi — edit firebase-config.js dengan config project Anda.');
  showFirebaseWarning('Firebase belum dikonfigurasi. Edit file firebase-config.js dengan config project Firebase Anda, lalu upload ulang ke GitHub.');
} else if (typeof firebase === 'undefined') {
  // SDK Firebase gagal dimuat (network bermasalah, CDN diblokir, dll)
  console.error('Firebase SDK tidak termuat (variabel global "firebase" tidak ditemukan).');
  showFirebaseWarning('Gagal memuat pustaka Firebase. Cek koneksi internet, lalu refresh halaman ini.');
} else {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    const auth = firebase.auth();

    // Anonymous sign-in: setiap orang yang buka link otomatis dapat sesi
    // "tanpa nama" dari Firebase, sehingga Security Rules bisa mensyaratkan
    // "harus sudah login" tanpa perlu sistem akun/password per orang.
    firebaseReady = auth.signInAnonymously()
      .then(() => true)
      .catch(err => {
        console.error('Firebase anonymous sign-in gagal:', err);
        showFirebaseWarning('Gagal login ke Firebase: ' + err.message + ' — cek apakah "Anonymous" sign-in sudah diaktifkan di Firebase Console → Authentication.');
        return false;
      });
  } catch (err) {
    console.error('Firebase gagal diinisialisasi:', err);
    showFirebaseWarning('Firebase gagal diinisialisasi: ' + err.message + ' — cek kembali nilai firebaseConfig di firebase-config.js.');
    firebaseReady = Promise.resolve(false);
  }
}
