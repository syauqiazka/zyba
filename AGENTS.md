AGENTS.md — ZYBA Web (Desktop)
Dokumen ini adalah satu-satunya sumber acuan untuk coding agent (Hermes+9Router, Antigravity, atau agent lain) yang melanjutkan development ZYBA. Semua keputusan desain, hasil review, dan perbaikan yang wajib dilakukan digabung di sini — agent tidak perlu mencari konteks di tempat lain.

⚠️ Baca urutan ini sebelum coding apa pun:

Bagian 8 — Status Review & Prioritas Perbaikan — 3 isu keamanan yang HARUS diperbaiki duluan.
Bagian 12 — Checklist Final — daftar centang sebelum submit lomba/deploy.
1. Ringkasan Produk
ZYBA — Gen Z Wellness Support. Pendamping kesehatan mental, fisik, dan sosial berbasis AI. Alur inti: Curhat → Solusi → Program → Aksi.

Stack: Next.js 14 (App Router) + Prisma + Neon Postgres, Tailwind CSS.

2. Rename Fitur (Figma → Nama Resmi Pitch Deck)
Figma UI kit awal dibuat dari template generik ("Doctor Freud.AI"). Semua kode, route, dan copy wajib pakai penamaan resmi berikut:

Nama di Figma / template	Nama resmi dipakai di build
Doctor Freud.AI / "Talk to Doctor Freud.AI"	Zyba Companion
Therapy Chat / Chatbot	Zyba Companion Chat
Mood / Mood Edit / Mood Stats	Mood Check-In
Zyba Hours / Zyba Exercise / Activity Tracker	Smart Activity Planner
Health Journal / Zyba Score / Stress Level dashboard gabungan	Wellness Journey
Community / Zyba Community	Zyba Community (nama sudah cocok, pertahankan)
"Logomark" / ikon bunga 4 kelopak oranye-hijau	Logo utama ZYBA, pertahankan sebagai favicon & brand mark
Status: sudah diimplementasikan di repo (dikonfirmasi lewat review langsung ke github.com/syauqiazka/zyba, dashboard tidak lagi menyebut "Freud").

3. Design Tokens
Warna diestimasi dari inspeksi visual Figma. Sudah diimplementasikan sebagai kelas Tailwind kustom di tailwind.config.ts — pakai nama kelas di kolom kanan, bukan hex mentah, supaya konsisten di seluruh kode.

3.1 Palet Warna
Token	Hex (estimasi)	Kelas Tailwind	Dipakai untuk
Cream	#F7F2E7	bg-cream / text-cream	Background utama, card default
Brown 900	#3B2A20	bg-brown-900 / text-brown-900	Teks utama, tombol primer gelap
Brown 700	#5A4636	text-brown-700	Teks sekunder
Green 500	#8FAE5D	bg-green-500 / text-green-500	Elemen "positif/sehat", CTA sekunder
Green 100	#E4EED2	bg-green-100	Background kartu hijau muda, nav item aktif
Orange 500	#F2884B	bg-orange-500 / text-orange-500	CTA utama, alert, upsell/Pro
Orange 100	#FCE3D3	bg-orange-100	Background kartu oranye muda, badge
Mood: Depressed	#A99BE0	bg-mood-depressed	Mood selector
Mood: Sad	#EE8A5E	bg-mood-sad	Mood selector
Mood: Neutral	#6B5645	bg-mood-neutral	Mood selector
Mood: Happy	#E8C24A	bg-mood-happy	Mood selector
Mood: Overjoyed	#8FAE5D	bg-mood-overjoyed	Mood selector
Danger	#D9534F	bg-danger / text-danger	Hanya untuk delete/destructive action, jangan dipakai untuk styling konten krisis pengguna
3.2 Tipografi
Montserrat ExtraBold — judul besar/display (32–40px)
Poppins SemiBold — subjudul/H1-H2 (18–24px)
Poppins Regular — isi/body (14–16px), caption (12px)
3.3 Komponen Inti
Button primer: pill/rounded-full (rounded-pill), background brown-900 atau orange-500, teks putih, ikon panah → di kanan.
Button sekunder: outline atau flat green-100.
Progress ring: lingkaran skor (mis. "Zyba Score 80") — dashboard & hasil assessment.
Mood selector: baris ikon ekspresif, 5 warna berbeda per mood.
Card resource/artikel: thumbnail + judul + meta, dipakai di Resource & Community feed.
Input field: rounded, ikon di kiri, konsisten di semua form.
Bottom nav (mobile) → desktop wajib jadi sidebar kiri.
Streak/stats badge: angka besar + label.
4. Taksonomi Layar (Screen Inventory)
A. Onboarding & Auth
Splash/Loading (4 varian warna brand)
Welcome carousel (5 slide)
Sign In / Sign Up (email, password, Google/social, 2FA)
Forgot Password
B. Profile & Account Setup
Select Avatar, Profile Setup
Password Setup (strength meter)
OTP Setup & Verifikasi (4 digit)
Fingerprint Setup
Notification Setup
Compiling Data (loading state)
"You're All Set Up"
C. Mental Health Assessment
Alur pertanyaan berurutan (goal, gender, usia, berat, mood, riwayat bantuan profesional, gejala fisik, kualitas tidur, level stres, obat, gejala mental lain, AI Expression Analysis).

⚠️ Layar "Expression Analysis" di source Figma berisi contoh teks krisis/ide bunuh diri sebagai dummy. Wajib diganti — lihat Bagian 8.

D. Resources
Listing (Articles/Courses), detail artikel, detail course, course player, course completed, paywall upsell.

E. Home / Dashboard
Greeting, Mental Health Metrics (Zyba Score + Stress Level), Zyba Tracker checklist, widget Zyba Companion, shortcut Resources.

F. Zyba Community
Lihat spesifikasi redesign lengkap di Bagian 11.

G. Mood Check-In & Tracking
Zyba Score detail, Stress Level detail, Mood Edit, Mood Stats, Health Journal.

H. Zyba Companion (AI Chat)
Lihat spesifikasi redesign lengkap di Bagian 10.

I. Smart Activity Planner
Sleep Quality, breathing exercise, exercise completed, activity target, choose activity, activity tracking, activity completed.

5. Panduan Konversi Mobile → Desktop
Navigasi: bottom nav mobile → sidebar kiri fixed (~240–280px): Dashboard, Mood Check-In, Zyba Companion, Smart Activity Planner, Wellness Journey, Zyba Community, Resources, Settings.
Layout grid: container max-width 1200–1280px, grid 12 kolom. Halaman list (Resources, Community, Activity) pakai grid multi-kolom (2–3 kolom).
Assessment: gabung jadi form multi-step — panel kiri progress stepper, panel kanan pertanyaan aktif.
Chat (Zyba Companion): dua panel — kiri daftar percakapan, kanan jendela chat aktif (pola WhatsApp Web/Slack).
Modal vs full page: Delete Conversation, OTP Verification, Forgot Password → jadi modal/dialog di desktop.
Komponen reusable: mood selector & progress ring dipertahankan ukurannya, disusun ulang dalam grid yang lebih lega.
Breakpoint: desktop ≥1024px = sidebar+grid; tablet 768–1023px = sidebar collapse icon-only; <768px = pola mobile asli.
6. Data & State Notes
Semua angka mock (skor 80, stress 3, 2.541 conversations, dll) adalah contoh — implementasikan sebagai data dinamis, jangan hardcode.
Zyba Plus (paywall/"Out of Tokens") harus punya state jelas: free-tier limit vs unlocked.
7. Tech Stack & Scaffold Code
Scaffold awal (zyba-web.zip, sudah di-push ke github.com/syauqiazka/zyba) berisi:

prisma/schema.prisma — data model lengkap (User, Assessment, MoodEntry, JournalEntry, ActivityLog, Conversation/Message, CommunityPost/Comment/Like, Resource), dual-URL Neon (DATABASE_URL pooled + DIRECT_URL direct).
src/lib/prisma.ts — Prisma client singleton.
src/lib/crisisDetection.ts — detectRisk() + CRISIS_RESOURCES, wajib dipanggil di setiap endpoint yang menerima teks bebas dari pengguna.
src/components/Sidebar.tsx — nav sidebar desktop.
src/app/mood-check-in/ + MoodSelector.tsx + api/mood/route.ts — contoh pola implementasi end-to-end, dicontoh/dicopy untuk fitur lain.
src/app/dashboard/page.tsx — contoh layout grid desktop.
Status aktual di repo (per review terakhir): sudah berkembang melampaui scaffold — halaman companion, community, activity, wellness-journey, resources, assessment, onboarding, plus middleware.ts untuk proteksi route dan api/auth/route.ts untuk login/signup/OTP, sudah ada dan strukturnya konsisten dengan Bagian 4.

8. Status Review & Prioritas Perbaikan
Review langsung ke kode di github.com/syauqiazka/zyba menemukan 3 isu keamanan nyata — prioritas di atas isu tampilan apa pun, karena menyangkut data kesehatan mental pengguna:

8.1 Password disimpan plain text (PRIORITAS TERTINGGI)
Lokasi: src/app/api/auth/route.ts — passwordHash: password || "demo_password". Masalah: kalau database bocor, semua password pengguna (dan data assessment kesehatan mental yang terhubung ke akun mereka) langsung terbuka. Perbaikan: hash password dengan bcrypt atau argon2 sebelum disimpan, dan compare() saat login — jangan pernah simpan/bandingkan password mentah.

// contoh perbaikan minimal
import bcrypt from "bcrypt";

// saat signup:
const passwordHash = await bcrypt.hash(password, 12);

// saat login:
const valid = await bcrypt.compare(inputPassword, user.passwordHash);
if (!valid) return NextResponse.json({ error: "Password salah" }, { status: 401 });
8.2 Session token gampang ditebak (PRIORITAS TERTINGGI)
Lokasi: src/app/api/auth/route.ts — sessionToken = \demo_${user.id}`. **Masalah**: siapa pun yang tahu/menebak user.id(angka/string berurutan atau bisa di-enumerasi) bisa memalsukan cookieauth-tokendan login sebagai user lain tanpa password. **Perbaikan**: gunakan token random & ditandatangani server (JWT dengan secret, atau UUID session yang disimpan di tabelSession` terpisah dan divalidasi tiap request), bukan string yang bisa dikonstruksi dari data publik.

8.3 Kode OTP dikembalikan di response API (PRIORITAS TINGGI)
Lokasi: src/app/api/auth/route.ts — field demoCode dikirim balik ke client. Masalah: OTP yang seharusnya jadi bukti kepemilikan email, kalau dikembalikan langsung di response, sama saja tidak ada verifikasi — siapa pun bisa signup atas nama email siapa pun tanpa akses ke email itu. Perbaikan: kirim OTP hanya lewat email/SMS asli (integrasi email service), jangan pernah sertakan di body response, bahkan untuk mode "demo" — ganti demo mode dengan OTP tetap (mis. 000000) yang didokumentasikan di README internal tim, bukan dikirim dinamis di response.

8.4 Landing page publik belum ada (PRIORITAS SEDANG)
Lokasi: src/app/page.tsx — saat ini langsung me-render DashboardPage. Masalah: siapa pun yang membuka domain root langsung melihat data dashboard tanpa login. Perbaikan: ganti dengan landing page publik. Spesifikasi & kode lengkap ada di Bagian 9.

Urutan pengerjaan yang disarankan: 8.1 → 8.2 → 8.3 → 8.4. Keamanan data pengguna lebih prioritas daripada landing page yang belum ada.

9. Spesifikasi Landing Page (Publik, Sebelum Login)
Referensi gaya: layout hero besar + stat row + grid fitur di bawah (mirip halaman marketing OpenRouter), tapi seluruh warna diganti ke palet ZYBA (cream/coklat/hijau/oranye) — bukan dark/neon.

Struktur halaman (ganti isi src/app/page.tsx, pindahkan render DashboardPage supaya hanya bisa diakses setelah auth):

Nav bar: logo ZYBA kiri, menu tengah (Fitur/Tentang/Komunitas) hidden di mobile, tombol "Masuk/Daftar" kanan → /onboarding.
Hero: badge kecil "GEN Z WELLNESS SUPPORT" (bg orange-100, teks orange-500), headline besar (font-display, 5xl–6xl) dengan kata kunci "Fisik" di-highlight text-green-500 dan "Sosial" di text-orange-500, subteks 1 kalimat, dua CTA ("Mulai Sekarang →" solid orange, "Lihat Fitur" outline).
Stat row: 4 angka besar (mis. dari Market Size pitch deck: 74,9jt Gen Z Indonesia, 81,1% pernah curhat ke AI, target 100rb+ pengguna, 3 aspek Mental/Fisik/Sosial).
Grid fitur (4 kartu, 1 baris di desktop): Zyba Companion, Mood Check-In, Smart Activity Planner, Zyba Community — tiap kartu: emoji/ikon, judul, deskripsi singkat.
CTA footer: section dengan bg green-100, headline ajakan, tombol "Gabung Gratis →".
Kode React lengkap siap pakai:

// src/app/page.tsx — GANTI isi file ini (yang lama hanya me-render Dashboard)
import Link from "next/link";

const STATS = [
  { value: "74,9jt", label: "Total Gen Z di Indonesia" },
  { value: "81,1%", label: "Pernah curhat ke AI" },
  { value: "100rb+", label: "Target pengguna terdaftar" },
  { value: "3", label: "Aspek: Mental, Fisik, Sosial" },
];

const FEATURES = [
  { title: "Zyba Companion", desc: "Curhat kapan saja ke AI companion yang mendengarkan tanpa menghakimi.", icon: "💬" },
  { title: "Mood Check-In", desc: "Catat mood harianmu, ZYBA bantu kenali pola dan beri insight.", icon: "🙂" },
  { title: "Smart Activity Planner", desc: "Program aktivitas fisik sederhana yang disesuaikan kondisimu.", icon: "⚡" },
  { title: "Zyba Community", desc: "Ruang aman berbagi cerita dengan sesama Gen Z, privasi terjaga.", icon: "🤝" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-brown-900">
      <header className="flex items-center justify-between px-10 py-6 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500" aria-hidden />
          <span className="font-display font-bold text-lg">ZYBA</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brown-700">
          <a href="#fitur">Fitur</a>
          <a href="#tentang">Tentang</a>
          <a href="#komunitas">Komunitas</a>
        </nav>
        <Link href="/onboarding" className="rounded-pill bg-brown-900 text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
          Masuk / Daftar
        </Link>
      </header>

      <section className="max-w-[1280px] mx-auto px-10 pt-16 pb-20 text-center flex flex-col items-center">
        <span className="inline-block rounded-pill bg-orange-100 text-orange-500 text-xs font-semibold px-4 py-1.5 mb-6">
          GEN Z WELLNESS SUPPORT
        </span>
        <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight max-w-3xl">
          Pendamping Kesehatan Mental, <span className="text-green-500">Fisik</span>, dan{" "}
          <span className="text-orange-500">Sosial</span> untuk Gen Z
        </h1>
        <p className="mt-6 text-brown-700 text-lg max-w-xl">
          Curhat, dapat solusi, ubah jadi program nyata — semua dalam satu ruang aman, privat, dan bebas dihakimi.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/onboarding" className="rounded-pill bg-orange-500 text-white px-8 py-3.5 font-semibold hover:opacity-90 transition-opacity">
            Mulai Sekarang →
          </Link>
          <a href="#fitur" className="rounded-pill border-2 border-brown-900/15 px-8 py-3.5 font-semibold hover:bg-white transition-colors">
            Lihat Fitur
          </a>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="font-display font-bold text-3xl text-brown-900">{s.value}</span>
              <span className="text-sm text-brown-700 mt-1 text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="fitur" className="max-w-[1280px] mx-auto px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-brown-900/10 flex flex-col gap-3">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-display font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-brown-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="komunitas" className="bg-green-100 py-16 px-10 text-center">
        <h2 className="font-display font-bold text-3xl max-w-lg mx-auto">
          Kamu nggak sendirian. ZYBA ada untuk dengarkan ceritamu.
        </h2>
        <Link href="/onboarding" className="inline-block mt-6 rounded-pill bg-brown-900 text-white px-8 py-3.5 font-semibold hover:opacity-90 transition-opacity">
          Gabung Gratis →
        </Link>
      </section>
    </div>
  );
}
Penting: dashboard yang sebelumnya dirender di / harus tetap bisa diakses di /dashboard (sudah ada, sudah dilindungi middleware.ts) — cukup hapus baris yang me-render DashboardPage langsung dari page.tsx root.

10. Spesifikasi Redesign Zyba Companion (AI Chat)
Halaman AI chat saat ini dinilai masih kurang matang secara visual. Spesifikasi berikut menggantikan implementasi tampilan yang ada — struktur data/API (Conversation, Message di Prisma) tetap dipakai, ini murni perbaikan UI.

10.1 Layout Dua Panel
Panel kiri (≈320px, fixed): daftar percakapan.
Header kecil: "Percakapan" + tombol "+ Baru" (bg orange-500, ikon plus, rounded-pill).
Tiap item: avatar/inisial, judul percakapan (auto dari pesan pertama, dipotong 1 baris), waktu relatif ("2j lalu"), dan titik kecil berwarna sesuai token mood (mood-happy, mood-sad, dst.) merepresentasikan emosi dominan percakapan itu — supaya user bisa scan riwayat emosinya sekilas tanpa buka satu-satu.
Item aktif: background green-100, border kiri orange-500 setebal 3px.
Panel kanan (flex-1): jendela chat aktif.
Header: avatar maskot ZYBA (bukan lagi ikon "Freud"), nama "Zyba Companion", status "● Online" (titik green-500), dan chip emosi di kanan header (mis. "Tenang", "Cemas") yang otomatis update berdasarkan analisis pesan terbaru — bg sesuai token mood terkait, teks putih, rounded-pill kecil.
Ikon pengaturan (gear) di ujung kanan header → buka panel "Chatbot Settings" (communication style: Casual/Formal/Fun) sebagai modal, bukan halaman terpisah.
10.2 Bubble Chat
Pesan user: rata kanan, bg brown-900, teks putih, rounded-2xl dengan sudut kanan-bawah lebih kecil (efek "ekor" chat bubble khas).
Pesan AI: rata kiri, bg putih/cream, teks brown-900, border tipis brown-900/10, avatar mascot kecil di kiri bubble.
Timestamp kecil (text-xs text-brown-700) di bawah tiap bubble, hanya muncul saat hover atau di pesan terakhir grup.
Typing indicator: 3 titik animasi berdenyut di dalam bubble AI kosong, dipakai selagi menunggu respons.
10.3 Empty/Intro State (perbaikan utama dari kesan "jelek")
Alih-alih layar kosong, tampilkan:

Ilustrasi mascot ZYBA di tengah.
Judul ramah: "Cerita apa hari ini?"
3–4 chip prompt starter yang bisa diklik langsung, mis. "Aku lagi stres tugas", "Butuh teman ngobrol aja", "Susah tidur akhir-akhir ini" — bg orange-100, teks brown-900, rounded-pill, klik langsung mengisi & mengirim pesan pertama. Ini pola umum yang bikin AI chat terasa "hidup" dan bukan kotak kosong menakutkan.
10.4 Input Area
Sticky di bawah panel kanan, bg putih, border atas brown-900/10.
Rounded-pill input full-width, placeholder "Ketik pesan ke Zyba...".
Ikon attachment (kertas klip) dan voice/mic di dalam input, kiri.
Tombol kirim: lingkaran orange-500, ikon panah putih, disabled state abu-abu saat input kosong.
10.5 Banner Krisis (jangan dilewatkan)
Jika detectRisk() mendeteksi risiko pada pesan user (lihat src/lib/crisisDetection.ts):

Tampilkan banner tenang di atas jendela chat (bukan di dalam bubble, bukan popup mengagetkan), bg lembut netral (bukan orange-500 yang terkesan promosi), berisi pesan singkat + kontak hotline dari CRISIS_RESOURCES.
Banner tidak boleh auto-dismiss — user harus sadar melihatnya, tapi tetap bisa ditutup manual.
Styling tidak boleh memakai warna/animasi playful (lihat catatan di Bagian 12).
10.6 State "Out of Chat Limit" (Free tier)
Modal overlay (bukan halaman baru), bg orange-100, ilustrasi kecil, teks "Kuota chat harian habis", tombol "Upgrade ke Zyba Plus →" (orange-500) dan link kecil "Nanti saja" untuk menutup modal.
11. Spesifikasi Redesign Zyba Community (Gaya Threads)
Referensi: layout feed ala Threads — sidebar kiri untuk navigasi, kolom feed di tengah, compose box di atas, tiap post berupa card dengan avatar+nama+waktu, teks, opsional gambar, dan action row (like, comment, repost, share). Struktur diikuti, tapi seluruh warna diganti ke palet ZYBA (Threads pakai dark/monokrom; ZYBA pakai cream/putih/coklat/hijau/oranye) — jangan bikin Community jadi dark-mode terpisah dari sisa app.

11.1 Layout
Sidebar kiri: pakai sidebar utama ZYBA yang sudah ada (Bagian 5.1) — tidak perlu sidebar terpisah khusus Community seperti di Threads, supaya navigasi tetap konsisten satu sistem di seluruh app.
Kolom feed (tengah, max-width ~600px, center di sisa ruang setelah sidebar): daftar post vertikal.
Tab sekunder di atas feed: "For You" / "Following" — style pill toggle, aktif = bg brown-900 teks putih, non-aktif = teks brown-700.
11.2 Compose Box (di atas feed, sebelum list post)
Card putih rounded-2xl, avatar user kiri, input placeholder "Ada cerita apa hari ini?", tombol "Post" kanan (bg orange-500, rounded-pill, disabled abu-abu kalau kosong).
Ikon attachment kecil di bawah input (foto, tag mood) — opsional, mengikuti pola "Add An Attachment" dari Figma asli.
11.3 Post Card
Struktur per-post (mengikuti pola Threads di referensi, dengan penyesuaian):

Header: avatar bulat, nama pengguna (bold, brown-900), badge "Terverifikasi" kecil kalau relevan (centang hijau green-500, bukan biru), waktu relatif (text-brown-700 text-sm), ikon "..." (menu: report/hapus) di ujung kanan.
Body: teks post (text-brown-900), hashtag di-style text-orange-500 (mis. #zybarocks, #gratefulness — ganti semua contoh hashtag lama yang menyebut "freud" jadi "zyba", lihat Bagian 2).
Gambar (opsional): rounded-xl, max-height terbatas, object-cover.
Action row (ikon outline, bukan solid, ukuran konsisten ~20px, gap merata):
❤️ Like — icon outline brown-700, saat aktif jadi solid orange-500 (bukan merah, supaya tetap dalam palet brand) + jumlah.
💬 Comment — buka thread balasan (inline expand di bawah post atau halaman detail).
🔁 Repost/Share ulang ke feed sendiri — icon panah melingkar.
➤ Share/kirim — icon kertas terbang, untuk share link post keluar app.
Semua angka count di sebelah kanan tiap ikon, text-sm text-brown-700.
Divider tipis border-brown-900/10 antar post, bukan card terpisah dengan shadow — supaya feed terasa mengalir seperti Threads, bukan tumpukan kartu terputus-putus.
11.4 Interaksi Tambahan
Comment: klik ikon comment → expand inline textarea kecil di bawah post (pola Threads: reply langsung di feed, tidak selalu pindah halaman) — untuk thread panjang, baru buka halaman detail post.
Empty state (belum follow siapa pun / feed kosong): ilustrasi ramah + headline "Belum ada cerita di sini" + CTA "Jelajahi komunitas →".
Privasi: tetap tampilkan indikator kecil di compose box "Postingan ini terlihat oleh komunitas" — mengingatkan bahwa ini beda dari curhat privat ke Zyba Companion (poin dari catatan privasi di Bagian 12).
12. Checklist Final Sebelum Submit/Deploy
Gabungan semua item wajib dari seluruh dokumen ini — centang satu-satu sebelum dianggap selesai:

Keamanan (prioritas tertinggi, lihat Bagian 8):

- [x] Password di-hash pakai bcrypt/argon2, tidak ada lagi plain text di mana pun.
- [x] Session token acak & ditandatangani server, tidak bisa ditebak dari user.id.
- [x] OTP tidak pernah dikembalikan di response API.
- [x] Landing page publik sudah menggantikan render dashboard langsung di /.

Konten & Safety (kesehatan mental):

- [x] Konten placeholder di layar "Expression Analysis" (Bagian 4.C) sudah diganti dari contoh krisis/ide bunuh diri ke contoh netral.
- [x] detectRisk() dari crisisDetection.ts dipanggil di semua endpoint yang menerima teks bebas (journal, expression analysis, chat companion, post community).
- [x] Banner/CTA terkait krisis tidak memakai styling playful/marketing (lihat 10.5) — tenang dan jelas.
- [x] Semua branding "Doctor Freud.AI" sudah diganti "Zyba Companion" di seluruh kode, termasuk contoh hashtag di Community (Bagian 11.3).

Desain & UX:

- [x] Zyba Companion pakai layout dua-panel + empty state dengan prompt starter (Bagian 10).
- [x] Zyba Community pakai struktur feed ala Threads dengan palet ZYBA, bukan dark mode terpisah (Bagian 11).
- [x] Semua warna pakai kelas Tailwind dari Bagian 3.1, tidak ada hex baru yang keluar dari palet.
- [x] Layout desktop konsisten: sidebar kiri fixed, container max-width 1200–1280px (Bagian 5).

Dokumen ini konsolidasi dari: review visual Figma UI kit awal, review langsung ke kode github.com/syauqiazka/zyba, dan referensi gaya (landing page ala OpenRouter, Community ala Threads) — semua warna referensi eksternal disesuaikan ke palet ZYBA, bukan ditiru mentah-mentah.