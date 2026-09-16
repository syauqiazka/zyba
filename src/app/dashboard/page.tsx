"use client";

import { useState } from "react";
import MetricScoreCard from "./components/MetricScoreCard";
import StressLevelChart from "./components/StressLevelChart";
import CompanionWidget from "./components/CompanionWidget";
import TrackerChecklist from "./components/TrackerChecklist";
import QuickAccessCards from "./components/QuickAccessCards";

export default function DashboardPage() {
  const [trackerState, setTrackerState] = useState<{ [key: string]: boolean }>({
    "Zyba Hours (Breathing)": true,
    "Mood Quality Check": true,
    "Health Journal Entry": false,
    "Daily Resource Reading": false,
    "Mental Journal Reflection": false,
    "Community Activity": true,
  });

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
        <MetricScoreCard />
        <StressLevelChart />
        <CompanionWidget />
      </section>

      <TrackerChecklist
        trackerState={trackerState}
        completedCount={completedCount}
        totalTrackers={totalTrackers}
        toggleTracker={toggleTracker}
      />

      <QuickAccessCards />
    </div>
  );
}
