"use client";

export default function StreakCard() {
  return (
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
  );
}
