"use client";

import Link from "next/link";

export default function StressLevelChart() {
  return (
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
  );
}
