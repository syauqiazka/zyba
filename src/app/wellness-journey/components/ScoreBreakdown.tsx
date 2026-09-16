"use client";

import Link from "next/link";

export default function ScoreBreakdown() {
  return (
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
  );
}
