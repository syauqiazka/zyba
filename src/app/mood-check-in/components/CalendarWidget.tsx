"use client";

export default function CalendarWidget() {
  return (
    <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-brown-900">
          Kalender Mood Bulanan
        </h3>
        <span className="text-xs text-brown-700 font-semibold">September 2026</span>
      </div>

      {/* Calendar Grid (Simulated 30 Days) */}
      <div className="grid grid-cols-7 gap-1.5 text-center my-2">
        {["S", "S", "R", "K", "J", "S", "M"].map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-brown-700/60 pb-1">
            {d}
          </span>
        ))}
        {Array.from({ length: 30 }).map((_, i) => {
          const day = i + 1;
          const colors = ["bg-mood-happy", "bg-mood-overjoyed", "bg-mood-neutral", "bg-mood-sad", "bg-mood-happy"];
          const bg = day <= 15 ? colors[day % colors.length] : "bg-cream";
          return (
            <div
              key={day}
              className={`h-7 rounded-lg text-[10px] font-bold flex items-center justify-center ${bg} ${
                day <= 15 ? "text-white shadow-xs" : "text-brown-700"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-brown-700 pt-2 border-t border-brown-900/10">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-mood-happy" /> Dominan: Happy (45%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-mood-overjoyed" /> Overjoyed (30%)
        </span>
      </div>
    </div>
  );
}
