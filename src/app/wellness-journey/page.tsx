"use client";

import { useState } from "react";
import Link from "next/link";

export default function WellnessJourneyPage() {
  const [selectedRange, setSelectedRange] = useState<"Minggu Ini" | "Bulan Ini">("Minggu Ini");

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider">
              Wellness Journey
            </span>
            <span className="text-xs text-brown-700">Analisis Holistik Kesehatan Mental & Fisik</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Perjalanan Kesehatan Mentalmu
          </h1>
          <p className="text-xs text-brown-700 mt-1 max-w-xl">
            Lacak perkembangan kestabilan emosi, riwayat stres, dan pencapaian jurnal mingguanmu dalam satu dashboard terpadu.
          </p>
        </div>

        {/* Range Filter */}
        <div className="flex items-center gap-2 bg-cream p-1.5 rounded-2xl border border-brown-900/10">
          {(["Minggu Ini", "Bulan Ini"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRange(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRange === r
                  ? "bg-brown-900 text-white shadow-sm"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Overview: Zyba Score Breakdown & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Zyba Score Component Breakdown */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-brown-900">
              Analisis Komponen Zyba Score (80/100)
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-500">
              Kondisi Stabil
            </span>
          </div>

          <div className="flex flex-col gap-4 my-2">
            {[
              { label: "Keseimbangan Emosional", score: 85, color: "bg-green-500", desc: "Refleksi mood stabil dalam 7 hari terakhir" },
              { label: "Resiliensi Stres", score: 75, color: "bg-orange-500", desc: "Tingkat respons positif terhadap tekanan" },
              { label: "Aktivitas Fisik & Tidur", score: 70, color: "bg-mood-depressed", desc: "Rata-rata tidur 5.2 jam per malam" },
              { label: "Dukungan Komunitas", score: 90, color: "bg-mood-happy", desc: "Partisipasi aktif di Zyba Community" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-cream/40 border border-brown-900/10">
                <div className="flex justify-between items-center text-xs font-bold text-brown-900">
                  <span>{item.label}</span>
                  <span>{item.score} / 100</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-cream overflow-hidden border border-brown-900/10">
                  <div
                    className={`h-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-[10px] text-brown-700">{item.desc}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-brown-900/10 flex items-center justify-between text-xs text-brown-700">
            <span>Metrik diperbarui otomatis secara real-time.</span>
            <Link href="/companion" className="font-bold text-orange-500 hover:underline">
              Tanya Zyba Companion →
            </Link>
          </div>
        </div>

        {/* Streak & Recommendations */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 border border-brown-900/10 bg-gradient-to-br from-orange-100/40 to-white flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Pencapaian Streak</span>
              <span className="font-display text-3xl font-extrabold text-brown-900 mt-1">34 Hari Aktif</span>
              <span className="text-xs text-brown-700 mt-0.5">Target: 365 Hari Mental Health Plan</span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white font-display font-bold flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30">
              🔥
            </div>
          </div>

          {/* AI Personalized Recommendations */}
          <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
            <h3 className="font-display text-base font-bold text-brown-900">
              💡 Rekomendasi Personal Zyba AI
            </h3>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-brown-900/10 flex flex-col gap-1">
                <span className="text-xs font-bold text-brown-900">1. Tingkatkan Durasi Tidur</span>
                <p className="text-xs text-brown-700 leading-relaxed">
                  Tidur di bawah 6 jam dapat meningkatkan kecenderungan stres sebesar 30%. Cobalah tidur 45 menit lebih awal malam ini.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-brown-900/10 flex flex-col gap-1">
                <span className="text-xs font-bold text-brown-900">2. Lakukan Sesi Breathing 5 Menit</span>
                <p className="text-xs text-brown-700 leading-relaxed">
                  Latihan relaksasi di menu Smart Activity Planner terbukti membantu memulihkan energi emosional di sela jam belajar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
