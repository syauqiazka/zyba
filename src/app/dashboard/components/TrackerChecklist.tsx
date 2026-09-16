"use client";

interface TrackerChecklistProps {
  trackerState: { [key: string]: boolean };
  completedCount: number;
  totalTrackers: number;
  toggleTracker: (key: string) => void;
}

export default function TrackerChecklist({
  trackerState,
  completedCount,
  totalTrackers,
  toggleTracker,
}: TrackerChecklistProps) {
  return (
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
  );
}
