"use client";

import { useState } from "react";
import Link from "next/link";
import GoogleAuthProfileModal from "@/components/GoogleAuthProfileModal";

const STATS = [
  { value: "74,9jt", label: "Total Gen Z di Indonesia" },
  { value: "81,1%", label: "Pernah curhat ke AI" },
  { value: "100rb+", label: "Target pengguna terdaftar" },
  { value: "3", label: "Aspek: Mental, Fisik, Sosial" },
];

const FEATURES = [
  {
    title: "Zyba Companion",
    desc: "Curhat kapan saja ke AI companion yang mendengarkan tanpa menghakimi.",
    icon: "💬",
    href: "/companion",
  },
  {
    title: "Mood Check-In",
    desc: "Catat mood harianmu, ZYBA bantu kenali pola dan beri insight.",
    icon: "🙂",
    href: "/mood-check-in",
  },
  {
    title: "Smart Activity Planner",
    desc: "Program aktivitas fisik sederhana yang disesuaikan kondisimu.",
    icon: "⚡",
    href: "/activity",
  },
  {
    title: "Zyba Community",
    desc: "Ruang aman berbagi cerita dengan sesama Gen Z, privasi terjaga.",
    icon: "🤝",
    href: "/community",
  },
];

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-cream text-brown-900 selection:bg-orange-100 selection:text-orange-500">
      {/* Public Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-3">
          {/* 4-petal floral logomark resmi ZYBA */}
          <div className="relative w-8 h-8 flex items-center justify-center rounded-2xl bg-cream border border-orange-500/20 shadow-sm">
            <div className="absolute w-3 h-3 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3 h-3 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2 opacity-90" />
            <div className="absolute w-3 h-3 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="absolute w-3 h-3 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2 opacity-90" />
            <div className="w-2 h-2 rounded-full bg-brown-900 z-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-tight text-brown-900">
              ZYBA
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brown-700">
          <a href="#fitur" className="hover:text-orange-500 transition-colors">
            Fitur
          </a>
          <a href="#tentang" className="hover:text-orange-500 transition-colors">
            Tentang
          </a>
          <a href="#komunitas" className="hover:text-orange-500 transition-colors">
            Komunitas
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="rounded-pill bg-brown-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-orange-500 transition-colors shadow-sm"
          >
            Masuk / Daftar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-10 pt-14 pb-20 text-center flex flex-col items-center">
        <span className="inline-block rounded-pill bg-orange-100 text-orange-500 text-xs font-semibold px-4 py-1.5 mb-6 tracking-wide">
          GEN Z WELLNESS SUPPORT
        </span>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight max-w-3xl text-brown-900">
          Pendamping Kesehatan Mental, <span className="text-green-500">Fisik</span>, dan{" "}
          <span className="text-orange-500">Sosial</span> untuk Gen Z
        </h1>

        <p className="mt-6 text-brown-700 text-base md:text-lg max-w-xl leading-relaxed">
          Curhat, dapat solusi, ubah jadi program nyata — semua dalam satu ruang aman, privat, dan bebas dihakimi.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="rounded-pill bg-orange-500 text-white px-8 py-3.5 font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            Mulai Sekarang →
          </button>
          <a
            href="#fitur"
            className="rounded-pill border-2 border-brown-900/15 px-8 py-3.5 font-semibold hover:bg-white transition-colors"
          >
            Lihat Fitur
          </a>
        </div>

        {/* Stat Row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="font-display font-bold text-3xl md:text-4xl text-brown-900">
                {s.value}
              </span>
              <span className="text-xs md:text-sm text-brown-700 mt-1 text-center font-medium">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Grid Fitur (4 kartu, 1 baris di desktop) */}
      <section id="fitur" className="max-w-[1280px] mx-auto px-6 md:px-10 pb-24">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
            Fitur Unggulan
          </span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-brown-900 mt-1">
            Didesain Khusus Menjawab Kebutuhan Gen Z
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-brown-900/10 flex flex-col gap-3 hover:border-orange-500/40 hover:shadow-md transition-all"
            >
              <span className="text-3xl" aria-hidden="true">
                {f.icon}
              </span>
              <h3 className="font-display font-semibold text-lg text-brown-900">
                {f.title}
              </h3>
              <p className="text-sm text-brown-700 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Tentang */}
      <section id="tentang" className="max-w-[1280px] mx-auto px-6 md:px-10 pb-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-brown-900/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
              Tentang ZYBA
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 text-brown-900">
              Alur Inti: Curhat → Solusi → Program → Aksi
            </h2>
            <p className="mt-4 text-sm text-brown-700 leading-relaxed">
              ZYBA memadukan AI empatik dan rencana aksi terstruktur. Mulai dari obrolan curhat harian yang aman tanpa stigma, pelacakan suasana hati harian, penyusunan kebiasaan positif dan aktivitas fisik terukur, hingga ruang komunitas yang saling menguatkan.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-4 bg-cream p-4 rounded-2xl border border-brown-900/10">
              <span className="text-2xl">🌱</span>
              <div>
                <p className="font-bold text-sm text-brown-900">100% Privat & Aman</p>
                <p className="text-xs text-brown-700">Data kesehatan mentalmu tersimpan aman</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-cream p-4 rounded-2xl border border-brown-900/10">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-bold text-sm text-brown-900">Bebas Dihakimi</p>
                <p className="text-xs text-brown-700">Ruang bercerita terbuka dan suportif</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section id="komunitas" className="bg-green-100 py-16 px-6 md:px-10 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-brown-900 leading-snug">
            Kamu nggak sendirian. ZYBA ada untuk dengarkan ceritamu.
          </h2>
          <p className="text-sm text-brown-700 mt-3 max-w-md">
            Mulai langkah kecilmu menuju kesehatan mental, fisik, dan sosial yang lebih seimbang hari ini.
          </p>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="inline-block mt-6 rounded-pill bg-brown-900 text-white px-8 py-3.5 font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            Gabung Gratis →
          </button>
        </div>
      </section>

      {/* Modal Google Auth -> Setup Profil */}
      <GoogleAuthProfileModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
