# AGENTS.md — ZYBA Web (Desktop)

Dokumen ini adalah panduan kerja untuk coding agent (Hermes+9Router, Antigravity, atau agent lain) yang akan membangun **versi desktop/web** dari aplikasi ZYBA. Sumber desain adalah Figma UI Kit mobile ("Zyba UI Kit") — dokumen ini menerjemahkan desain mobile itu ke pedoman implementasi desktop, plus penyesuaian nama fitur supaya konsisten dengan pitch deck resmi.

> ⚠️ **WAJIB dibaca sebelum coding**: lihat bagian [Penyesuaian Wajib Sebelum Build](#penyesuaian-wajib-sebelum-build) di bagian bawah — ada rename fitur dan satu isu konten sensitif di layar assessment yang harus diperbaiki dulu.

---

## 1. Ringkasan Produk

ZYBA — Gen Z Wellness Support. Pendamping kesehatan mental, fisik, dan sosial berbasis AI. Alur inti: **Curhat → Solusi → Program → Aksi**.

---

## 2. Rename Fitur (Figma → Nama Resmi Pitch Deck)

Figma UI kit ini dibuat dari template generik ("Doctor Freud.AI") dan sebagian nama layar belum sinkron dengan pitch deck resmi. Agent **harus** memakai penamaan resmi berikut di seluruh kode (komponen, route, label UI, copy):

| Nama di Figma / template | Nama resmi dipakai di build |
|---|---|
| Doctor Freud.AI / "Talk to Doctor Freud.AI" | **Zyba Companion** |
| Therapy Chat / Chatbot | **Zyba Companion Chat** |
| Mood / Mood Edit / Mood Stats | **Mood Check-In** |
| Zyba Hours / Zyba Exercise / Activity Tracker | **Smart Activity Planner** |
| Health Journal / Zyba Score / Stress Level dashboard gabungan | **Wellness Journey** |
| Community / Zyba Community | **Zyba Community** (nama sudah cocok, pertahankan) |
| "Logomark" / ikon bunga 4 kelopak oranye-hijau | Logo utama ZYBA, pertahankan sebagai favicon & brand mark |

Ganti semua string di UI dan komponen yang masih menyebut "Freud" atau "Doctor Freud.AI" menjadi "Zyba" / "Zyba Companion".

---

## 3. Design Tokens

> Warna berikut diestimasi dari inspeksi visual screenshot Figma (bukan color-picker presisi). Sebelum final, agent/developer disarankan verifikasi hex asli langsung dari file Figma (klik elemen → Inspect panel) jika tersedia aksesnya.

### 3.1 Palet Warna

```css
:root {
  /* Base / neutral */
  --zyba-cream: #F7F2E7;        /* background utama, card default */
  --zyba-brown-900: #3B2A20;    /* teks utama, tombol primer gelap */
  --zyba-brown-700: #5A4636;    /* teks sekunder */

  /* Brand accent */
  --zyba-green-500: #8FAE5D;    /* sage green — elemen "positif/sehat", CTA sekunder */
  --zyba-green-100: #E4EED2;    /* background kartu hijau muda */
  --zyba-orange-500: #F2884B;   /* coral/orange — CTA utama, alert, upsell/Pro */
  --zyba-orange-100: #FCE3D3;

  /* Mood-state accents (dipakai khusus di Mood Check-In) */
  --mood-depressed: #A99BE0;    /* lavender/purple */
  --mood-sad: #EE8A5E;          /* orange-red */
  --mood-neutral: #6B5645;      /* coklat netral */
  --mood-happy: #E8C24A;        /* kuning */
  --mood-overjoyed: #8FAE5D;    /* hijau */

  /* Status */
  --success: #8FAE5D;
  --warning: #F2884B;
  --danger: #D9534F;            /* dipakai HANYA untuk delete/destructive action, bukan untuk styling konten krisis pengguna */
}
```

### 3.2 Tipografi

- Font sans-serif rounded/friendly (mirip Poppins/Nunito — sesuai rekomendasi font di pitch deck: **Montserrat ExtraBold** untuk judul besar, **Poppins SemiBold** untuk subjudul, **Poppins Regular** untuk isi).
- Skala: Display (32–40px) untuk headline splash/welcome, H1 (24px) judul halaman, H2 (18px) judul kartu, Body (14–16px), Caption (12px) untuk label kecil/status.

### 3.3 Komponen Inti (dari observasi UI kit)

- **Button primer**: pill/rounded-full, background `--zyba-brown-900` atau `--zyba-orange-500`, teks putih, ikon panah `→` di kanan.
- **Button sekunder**: outline atau flat hijau muda.
- **Progress ring**: lingkaran skor (contoh "Zyba Score 80", "Mental Score") — dipakai di dashboard & hasil assessment.
- **Mood selector**: baris ikon emoji/muka ekspresif berwarna beda per mood (5 level: depressed, sad, neutral, happy, overjoyed).
- **Card resource/artikel**: thumbnail gambar + judul + meta (durasi/penulis), dipakai di halaman Resource & Community feed.
- **Input field**: rounded, ikon di kiri, style konsisten di semua form (signup, profile setup, OTP).
- **Bottom nav (mobile)** → di desktop **wajib** dikonversi jadi **sidebar nav kiri** (lihat bagian 5).
- **Streak / stats badge**: angka besar + label (contoh "1571 Total Conversations", "34/365 Journal streak", "5.2h Total Duration").

---

## 4. Taksonomi Layar (Screen Inventory)

### A. Onboarding & Auth
1. Splash/Loading (4 varian warna brand)
2. Welcome carousel (5 slide: intro produk, "Personalize Your Mental Health State With AI", "Intelligent Mood Tracking & Emotion Insights", "Mindful Resources That Makes You Happy", "Loving & Supportive Community")
3. Sign In / Sign Up (email, password, opsi Google/social login, 2FA/Google Authenticator)
4. Forgot Password

### B. Profile & Account Setup
5. Select Avatar, Profile Setup (nama, email, phone, lokasi, bio)
6. Password Setup (strength meter)
7. OTP Setup & Verifikasi (4 digit)
8. Fingerprint Setup
9. Notification Setup (toggle: chatbot notif, wellness notif, community notif)
10. Compiling Data (loading state)
11. "You're All Set Up" (skor awal onboarding, mis. "80")

### C. Mental Health Assessment (onboarding kuisioner)
Alur pertanyaan berurutan, masing-masing 1 layar dengan progress bar atas:
- Goal kesehatan hari ini
- Gender, usia, berat badan
- Mood saat ini (skala wajah)
- Riwayat mencari bantuan profesional
- Gejala fisik yang dialami
- Rating kualitas tidur
- Rating level stres (skala 1–5)
- Obat/suplemen yang sedang dikonsumsi
- Gejala kesehatan mental lain
- **AI Sound/Expression Analysis** — layar hasil analisis + free-text input ekspresi pengguna

> ⚠️ Layar terakhir kategori ini ("Expression Analysis") di source Figma berisi contoh teks curhatan yang menggambarkan ide bunuh diri sebagai placeholder demo. **Ini harus diganti sebelum masuk development** — lihat bagian 7.

### D. Resources
- Our Resources (listing kategori: Articles, Courses)
- Article detail (mis. "What is Life? Why?")
- Course detail (mis. "Mindfulness 101")
- Course player (audio/video dengan timer, mis. "Mindfulness Meditation Intro 05:55")
- Course Completed (celebratory state)
- Paywall/"Unlock Full Article/Course" (upsell ke Zyba Plus)

### E. Home / Dashboard
- Greeting header ("Hi, [Nama]!")
- Ringkasan **Mental Health Metrics**: Zyba Score (ring hijau) + Stress Level (bar chart oranye)
- **Zyba Tracker** checklist harian (Zyba Hours, Mood Quality, Health Journal, Resources, Mental Journal, Zyba Community Activity)
- Widget **Zyba Companion** (counter percakapan, mis. "2,541 Conversations")
- Shortcut ke Resources

### F. Zyba Community
- Welcome to Community (state kosong/intro)
- Community feed (list post dengan foto, nama user, badge verified, like/comment)
- Create Post (textarea + attachment: photo, prescription, metrics, dll)
- Post detail / interaksi

### G. Mood Check-In & Tracking
- Zyba Score detail (grafik riwayat, insight, rekomendasi)
- Stress Level detail (grafik riwayat, insight)
- Mood Edit (pilih 1 dari 5 mood: Depressed/Sad/Neutral/Happy/Overjoyed) — tiap mood punya warna background dedicated (lihat token 3.1)
- Mood Stats (riwayat kalender/statistik)
- Health Journal (streak counter, mis. "34/365", riwayat entri, tambah entri baru dengan mood tag)

### H. Zyba Companion (AI Chat)
- Intro/empty state ("Talk to Zyba Companion")
- Conversation list (riwayat chat, total percakapan, response speed indicator)
- Chat interface (bubble chat, emotion tag di header seperti "Emotion: Anger, Despair", voice input, attachment)
- Chatbot Settings (nama panggilan, communication style: Casual/Formal/Fun, model/privacy checkpoint)
- Therapy/therapist recommendation card
- Milestone Achievement (celebratory badge saat progress tertentu)
- Delete Conversation (confirmation dialog)
- "Out of Chat Limit" / Upgrade to Pro paywall

### I. Smart Activity Planner
- Sleep Quality (level, jam tidur, insight — mis. "Level 1: You are Insomniac", "5.2h Total Duration")
- Zyba Hours — breathing exercise (timer, durasi custom, kategori Stress Relief)
- Exercise Completed (celebratory state)
- Activity target (progress lingkaran, mis. "1200 target")
- Choose Activity (Walking / Running / Workout)
- Activity tracking (jarak, waktu, progress ring real-time)
- Activity Completed ("You Did It, [Nama]!")

---

## 5. Panduan Konversi Mobile → Desktop

Figma sumber adalah frame mobile (single column, lebar ~375px). Untuk versi desktop, terapkan pola berikut:

1. **Navigasi**: bottom nav mobile → **sidebar kiri fixed** (lebar ~240–280px) berisi: Dashboard/Home, Mood Check-In, Zyba Companion, Smart Activity Planner, Wellness Journey, Zyba Community, Resources, Settings. (Lihat referensi layout ini juga sudah ada di beberapa mockup dashboard Figma yang formatnya web/browser, bukan mobile — gunakan itu sebagai acuan tambahan.)

2. **Layout grid**: konten utama pakai container max-width (mis. 1200–1280px), grid 12-kolom. Halaman dashboard/list (Resources, Community feed, Activity) pakai **multi-kolom card grid** (2–3 kolom) alih-alih single-column stack ala mobile.

3. **Halaman single-question assessment** (bagian C): di mobile satu pertanyaan = satu layar penuh dengan swipe. Di desktop, gabungkan jadi **satu form multi-step dengan panel kiri progress stepper** + panel kanan pertanyaan aktif, supaya tidak terasa kosong di layar lebar.

4. **Chat interface (Zyba Companion)**: gunakan layout **dua panel** — kiri daftar percakapan (list, seperti sidebar chat app), kanan jendela chat aktif. Ini pola desktop standar (mirip WhatsApp Web/Slack), bukan full-screen chat seperti di mobile.

5. **Modal vs full page**: hal seperti "Delete Conversation", "OTP Verification", "Forgot Password" yang di mobile full-screen → di desktop jadi **modal/dialog** di atas halaman yang relevan.

6. **Card mood-selector & progress ring**: ukuran dan proporsi tetap dipertahankan sebagai komponen reusable, cukup disusun dalam grid/dashboard yang lebih lega, bukan didesain ulang total.

7. **Responsive breakpoint minimum**: desktop ≥1024px pakai layout sidebar+grid di atas; 768–1023px (tablet) sidebar bisa collapse jadi icon-only; <768px kembalikan ke pola mobile asli dari Figma.

---

## 6. Data & State Notes untuk Agent

- Semua angka statistik di mock (skor 80, stress level 3, 2,541 conversations, dll) adalah **contoh/dummy** — implementasikan sebagai data dinamis dari backend/state, jangan hardcode.
- Fitur Zyba Plus (paywall/"Out of Tokens") harus punya state jelas: free-tier limit vs unlocked, sesuai Business Model di pitch deck (Zyba Free vs Zyba Plus).

---

## 7. Tech Stack & Scaffold Code

Stack yang dipakai: **Next.js 14 (App Router) + Prisma + Neon Postgres**, Tailwind untuk styling dengan token di bagian 3.

Scaffold awal (`zyba-web.zip`) sudah tersedia sebagai starting point, berisi:

- `prisma/schema.prisma` — data model lengkap untuk semua fitur di bagian 4 (User, Assessment, MoodEntry, JournalEntry, ActivityLog, Conversation/Message untuk Zyba Companion, CommunityPost/Comment/Like, Resource), sudah dikonfigurasi dual-URL untuk Neon (`DATABASE_URL` pooled + `DIRECT_URL` direct, lihat `.env.example`).
- `src/lib/prisma.ts` — Prisma client singleton.
- `src/lib/crisisDetection.ts` — helper `detectRisk()` + `CRISIS_RESOURCES`, **wajib dipanggil** di setiap endpoint yang menerima teks bebas dari pengguna (journal, expression analysis, chat companion) sebelum data disimpan/direspons.
- `src/components/Sidebar.tsx` — implementasi nav sidebar desktop sesuai bagian 5.1.
- Contoh implementasi lengkap 1 fitur end-to-end (Mood Check-In): `src/app/mood-check-in/page.tsx` + `src/components/MoodSelector.tsx` + `src/app/api/mood/route.ts`. **Pola ini yang harus diikuti/di-copy untuk fitur lain** (Zyba Companion, Smart Activity Planner, Wellness Journey, Zyba Community, Resources) — bukan didesain ulang dari nol.
- `src/app/dashboard/page.tsx` — contoh layout grid desktop untuk halaman ringkasan/Home sesuai bagian 5.2.
- `README.md` di dalam scaffold — instruksi setup Neon step-by-step dan panduan menambah halaman baru.

Agent (Hermes+9Router / Antigravity) yang melanjutkan development **harus** memakai scaffold ini sebagai basis, bukan membuat struktur project baru dari nol.

---

## 8. Penyesuaian Wajib Sebelum Build

1. **Rename semua branding "Doctor Freud.AI" → "Zyba Companion"** di seluruh komponen chat, sesuai tabel di bagian 2.
2. **Ganti konten placeholder di layar "Expression Analysis"** (bagian assessment). Layar ini saat ini memakai contoh curhatan bernada krisis/ide bunuh diri sebagai dummy text — ganti dengan contoh netral (mis. keluhan stres kuliah/kerja biasa) untuk keperluan demo/dev, dan pisahkan logika **crisis-detection** sebagai fitur backend tersendiri (bukan sekadar teks statis di UI): jika input pengguna terdeteksi mengandung indikasi bahaya diri, sistem harus mengarahkan ke jalur eskalasi (hotline resmi/human handoff), bukan diproses seperti curhatan biasa oleh chatbot.
3. Pastikan tombol/CTA terkait krisis ini **tidak** diberi styling seperti CTA marketing biasa (warna cerah/playful) — gunakan pola UI yang lebih tenang dan jelas mengarahkan ke bantuan.

---

*Dokumen ini dibuat berdasarkan review visual screenshot Figma UI kit ZYBA (6 gambar overview) per tanggal penyusunan. Kalau ada layar yang belum ditangkap detail spesifiknya (misal isi persis copy tiap tombol), agent disarankan merujuk langsung ke file Figma sumber saat implementasi detail.*