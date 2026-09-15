"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [trackerState, setTrackerState] = useState<{ [key: string]: boolean }>({
    "Zyba Hours (Breathing)": true,
    "Mood Quality Check": true,
    "Health Journal Entry": false,
    "Daily Resource Reading": false,
    "Mental Journal Reflection": false,
    "Community Activity": true,
  });

  const [quickInput, setQuickInput] = useState("");

  const completedCount = Object.values(trackerState).filter(Boolean).length;
  const totalTrackers = Object.keys(trackerState).length;

  const toggleTracker = (key: string) => {
    setTrackerState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-500 text-xs font-bold uppercase tracking-wider">
              Welcome back
            </span>
            <span className="text-xs text-brown-700">| Selasa, 15 Sep 2026</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Hi, Alex Rivera! 👋
          </h1>
          <p className="text-brown-700 text-sm mt-1 max-w-xl">
            Kondisi mentalmu minggu ini stabil. Mari luangkan 5 menit untuk relaksasi dan check-in mood hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-brown-900">Daily Streak</span>
            <span className="text-xs text-brown-700">34/365 Hari Aktif</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-display font-extrabold flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">
            🔥 34
          </div>
        </div>
      </div>

      {/* Grid Overview Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Zyba Score Ring */}
        <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
              Zyba Score
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-500">
              Kondisi Baik
            </span>
          </div>

          <div className="my-6 flex items-center justify-center relative">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#FCE3D3"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#8FAE5D"
                strokeWidth="12"
                strokeDasharray={377}
                strokeDashoffset={377 * (1 - 0.8)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display text-4xl font-extrabold text-brown-900">
                80
              </span>
              <span className="text-[10px] text-brown-700 font-semibold uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <p className="text-xs text-brown-700 text-center">
            Skor kesejahteraan mental dan fisik gabungan berdasarkan aktivitas harianmu.
          </p>
        </div>

        {/* Metric 2: Stress Level Chart */}
        <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
              Stress Level (Minggu Ini)
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-500">
              Level 2 - Rendah
            </span>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-28 my-2 px-2">
            {[
              { day: "Sen", val: 40, active: false },
              { day: "Sel", val: 25, active: true },
              { day: "Rab", val: 50, active: false },
              { day: "Kam", val: 30, active: false },
              { day: "Jum", val: 20, active: false },
              { day: "Sab", val: 15, active: false },
              { day: "Min", val: 20, active: false },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  style={{ height: `${bar.val}%` }}
                  className={`w-full rounded-t-xl transition-all duration-500 ${
                    bar.active ? "bg-orange-500 shadow-md shadow-orange-500/20" : "bg-orange-100"
                  }`}
                />
                <span className="text-[10px] font-semibold text-brown-700">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-brown-900/10 text-brown-700">
            <span>Rata-rata: 2.1 / 5</span>
            <Link href="/mood-check-in" className="font-bold text-orange-500 hover:underline">
              Detail Mood →
            </Link>
          </div>
        </div>

        {/* Metric 3: Zyba Companion Widget */}
        <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-br from-white to-green-100/30">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
                Zyba Companion
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Online AI
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-3xl font-extrabold text-brown-900">
                2,541
              </span>
              <span className="text-xs text-brown-700 font-medium">Conversations Logged</span>
            </div>
            <p className="text-xs text-brown-700 mt-2">
              Siap mendengarkan cerita, memberikan teknik coping, atau sekadar berbincang santai.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-cream/80 p-1.5 rounded-2xl border border-brown-900/10">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Curhat sesuatu ke Zyba..."
                className="bg-transparent px-3 text-xs w-full focus:outline-none text-brown-900"
              />
              <Link
                href={`/companion?initialMsg=${encodeURIComponent(quickInput)}`}
                className="bg-brown-900 text-cream px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-orange-500 transition-colors shrink-0"
              >
                Chat →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist Harian: Zyba Tracker */}
      <section className="glass-card rounded-3xl p-7 border border-brown-900/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-extrabold text-brown-900">
              Zyba Tracker Checklist
            </h2>
            <p className="text-xs text-brown-700 mt-0.5">
              Selesaikan rutinitas harianmu untuk menjaga Zyba Score tetap optimal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brown-900">
              {completedCount} / {totalTrackers} Selesai
            </span>
            <div className="w-24 h-2 rounded-full bg-cream overflow-hidden border border-brown-900/10">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(completedCount / totalTrackers) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: "Zyba Hours (Breathing)", category: "Mindfulness", icon: "🫁", href: "/activity" },
            { key: "Mood Quality Check", category: "Emotional", icon: "😊", href: "/mood-check-in" },
            { key: "Health Journal Entry", category: "Reflection", icon: "📓", href: "/mood-check-in" },
            { key: "Daily Resource Reading", category: "Knowledge", icon: "📖", href: "/resources" },
            { key: "Mental Journal Reflection", category: "Wellness", icon: "🧘‍♂️", href: "/wellness-journey" },
            { key: "Community Activity", category: "Social Support", icon: "💬", href: "/community" },
          ].map((item) => {
            const isChecked = trackerState[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleTracker(item.key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isChecked
                    ? "bg-green-100/50 border-green-500/30 text-brown-900"
                    : "bg-white border-brown-900/10 hover:border-orange-500/40 text-brown-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isChecked ? "bg-green-500 text-white" : "border-2 border-brown-900/20 bg-cream"
                    }`}
                  >
                    {isChecked ? "✓" : ""}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{item.key}</span>
                    <span className="text-[10px] text-brown-700/80">{item.category}</span>
                  </div>
                </div>
                <span className="text-lg">{item.icon}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shortcut Quick Access & Resources */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Smart Activity Shortcut */}
        <div className="glass-card rounded-3xl p-6 flex items-center justify-between bg-gradient-to-r from-orange-100/40 to-cream border border-orange-500/20">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
              Smart Activity Planner
            </span>
            <h3 className="font-display text-lg font-bold text-brown-900">
              Sesi Latihan Pernapasan 3 Menit
            </h3>
            <p className="text-xs text-brown-700 max-w-sm">
              Turunkan tingkat kortisol dan kembalikan fokus belajar/kerjamu.
            </p>
            <Link
              href="/activity"
              className="mt-2 inline-flex items-center gap-2 bg-brown-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-500 transition-colors w-max"
            >
              Mulai Sesi →
            </Link>
          </div>
          <div className="text-5xl opacity-80">🫁</div>
        </div>

        {/* Resources Recommendation */}
        <div className="glass-card rounded-3xl p-6 flex items-center justify-between bg-gradient-to-r from-green-100/40 to-cream border border-green-500/20">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
              Rekomendasi Hari Ini
            </span>
            <h3 className="font-display text-lg font-bold text-brown-900">
              Mindfulness 101: Mengatasi Overthinking
            </h3>
            <p className="text-xs text-brown-700 max-w-sm">
              Audio panduan 5:55 menit untuk meredakan kecemasan akademik.
            </p>
            <Link
              href="/resources"
              className="mt-2 inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-brown-900 transition-colors w-max"
            >
              Dengar Audio →
            </Link>
          </div>
          <div className="text-5xl opacity-80">🎧</div>
        </div>
      </section>
    </div>
  );
}
