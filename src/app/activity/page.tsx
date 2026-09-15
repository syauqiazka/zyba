"use client";

import { useState, useEffect } from "react";

export default function SmartActivityPlannerPage() {
  // Breathing timer state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"Tarik Napas" | "Tahan Napas" | "Hembuskan">("Tarik Napas");
  const [breathTimer, setBreathTimer] = useState(180); // 3 minutes in seconds
  const [activeTab, setActiveTab] = useState<"WALKING" | "RUNNING" | "WORKOUT">("WALKING");
  const [activityProgress, setActivityProgress] = useState(850); // steps/kcal
  const targetProgress = 1200;
  const [isCompleted, setIsCompleted] = useState(false);

  // Breathing timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathingActive && breathTimer > 0) {
      interval = setInterval(() => {
        setBreathTimer((prev) => prev - 1);
      }, 1000);
    } else if (breathTimer === 0) {
      setBreathingActive(false);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathTimer]);

  // Breathing animation phases loop (Inhale 4s -> Hold 4s -> Exhale 4s)
  useEffect(() => {
    let phaseInterval: NodeJS.Timeout;
    if (breathingActive) {
      const phases: ("Tarik Napas" | "Tahan Napas" | "Hembuskan")[] = ["Tarik Napas", "Tahan Napas", "Hembuskan"];
      let index = 0;
      phaseInterval = setInterval(() => {
        index = (index + 1) % phases.length;
        setBreathingPhase(phases[index]);
      }, 4000);
    }
    return () => clearInterval(phaseInterval);
  }, [breathingActive]);

  const handleAddProgress = () => {
    const next = activityProgress + 150;
    setActivityProgress(next);
    if (next >= targetProgress) {
      setIsCompleted(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-gradient-to-r from-green-100/50 via-white to-orange-100/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold uppercase tracking-wider">
              Smart Activity Planner
            </span>
            <span className="text-xs text-brown-700">15 Sep 2026</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Rencanakan Aktivitas & Relaksasi
          </h1>
          <p className="text-xs text-brown-700 mt-1 max-w-xl">
            Kombinasi gerak fisik dan latihan pernapasan untuk menjaga stamina serta kestabilan emosi sepanjang hari.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-2xl border border-brown-900/10 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-brown-700">Target Hari Ini</span>
            <span className="font-display text-2xl font-extrabold text-orange-500">
              {activityProgress} / {targetProgress}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Section 1: Sleep Quality & Zyba Hours Breathing Exercise */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sleep Quality Insights Card */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col justify-between bg-gradient-to-b from-white to-cream/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
                Sleep Quality Dashboard
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-500">
                Level 1: Insomniac
              </span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="font-display text-5xl font-extrabold text-brown-900">5.2h</span>
              <span className="text-xs text-brown-700 font-semibold">Total Durasi Tidur</span>
            </div>

            <p className="text-xs text-brown-700 leading-relaxed mt-2 bg-cream/70 p-4 rounded-2xl border border-brown-900/10">
              💡 <strong>Insight Zyba:</strong> Kamu terbangun 2 kali tadi malam. Cobalah hindari kafein setelah jam 4 sore dan ikuti latihan pernapasan Zyba Hours sebelum tidur.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-brown-900/10 text-center">
            <div className="bg-white p-3 rounded-2xl border border-brown-900/10">
              <span className="text-[10px] text-brown-700 font-bold uppercase">Deep Sleep</span>
              <span className="block font-display text-lg font-bold text-brown-900">1h 15m</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-brown-900/10">
              <span className="text-[10px] text-brown-700 font-bold uppercase">Sleep Efficiency</span>
              <span className="block font-display text-lg font-bold text-green-500">72%</span>
            </div>
          </div>
        </div>

        {/* Zyba Hours — Breathing Exercise Interactive Widget */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col items-center justify-between text-center relative overflow-hidden bg-gradient-to-br from-white via-green-100/20 to-cream">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs font-bold text-green-500 uppercase tracking-wider flex items-center gap-1.5">
              🫁 Zyba Hours — Breathing Exercise
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-500">
              Stress Relief Mode
            </span>
          </div>

          {/* Animated Breathing Circle */}
          <div className="my-6 relative flex items-center justify-center">
            <div
              className={`w-44 h-44 rounded-full bg-gradient-to-tr from-green-500/30 to-orange-500/30 flex items-center justify-center transition-transform duration-1000 ${
                breathingActive ? "animate-breathe" : "scale-100"
              }`}
            >
              <div className="w-32 h-32 rounded-full bg-white shadow-xl flex flex-col items-center justify-center p-2 border border-brown-900/10">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                  {breathingActive ? breathingPhase : "Relaksasi"}
                </span>
                <span className="font-display text-3xl font-extrabold text-brown-900 mt-1">
                  {formatTime(breathTimer)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-brown-700 max-w-md mb-4">
            Ikuti ritme lingkaran pernapasan (Tarik Napas 4 detik, Tahan 4 detik, Hembuskan 4 detik) untuk meredakan ketegangan sistem saraf.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setBreathingActive(!breathingActive)}
              className={`px-8 py-3 rounded-full text-xs font-bold text-white transition-all shadow-md ${
                breathingActive
                  ? "bg-orange-500 hover:bg-brown-900"
                  : "bg-brown-900 hover:bg-green-500"
              }`}
            >
              {breathingActive ? "Jeda Sesi" : "Mulai Pernapasan →"}
            </button>
            <button
              type="button"
              onClick={() => {
                setBreathingActive(false);
                setBreathTimer(180);
              }}
              className="px-4 py-3 rounded-full text-xs font-bold border border-brown-900/10 bg-white text-brown-700 hover:bg-cream"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Grid Section 2: Choose Activity & Tracking Progress */}
      <div className="glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-extrabold text-brown-900">
              Pelacak Activity & Workout
            </h2>
            <p className="text-xs text-brown-700 mt-0.5">
              Pilih mode aktivitas fisik harianmu untuk memperbarui Zyba Score.
            </p>
          </div>

          {/* Activity Type Selector Tabs */}
          <div className="flex items-center gap-2 bg-cream p-1.5 rounded-2xl border border-brown-900/10">
            {[
              { id: "WALKING", label: "Walking 🚶‍♂️" },
              { id: "RUNNING", label: "Running 🏃‍♂️" },
              { id: "WORKOUT", label: "Workout 🏋️‍♂️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-brown-900 text-white shadow-sm"
                    : "text-brown-700 hover:text-brown-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Progress Ring & Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-brown-900/10">
          <div className="flex flex-col items-center justify-center border-r border-brown-900/10 pr-4">
            <span className="text-xs font-bold text-brown-700 uppercase tracking-wider mb-2">
              Progress Real-Time
            </span>
            <span className="font-display text-4xl font-extrabold text-brown-900">
              {activityProgress} <span className="text-xs text-brown-700">/ {targetProgress}</span>
            </span>
            <span className="text-[11px] text-green-500 font-bold mt-1">
              {Math.round((activityProgress / targetProgress) * 100)}% Target Tercapai
            </span>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-brown-700">Estimasi Kalori Terbakar:</span>
              <span className="font-bold text-brown-900">320 kcal</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-brown-700">Durasi Aktif:</span>
              <span className="font-bold text-brown-900">42 Menit</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-brown-700">Jarak Tempuh:</span>
              <span className="font-bold text-brown-900">3.4 km</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 bg-cream/50 p-4 rounded-2xl border border-brown-900/10">
            <button
              onClick={handleAddProgress}
              className="w-full py-3 rounded-full bg-green-500 hover:bg-brown-900 text-white font-bold text-xs transition-colors shadow-md"
            >
              + Tambah 150 Langkah / Aktivitas
            </button>
            <span className="text-[10px] text-brown-700">Tekan untuk menyimulasikan progress aktivitas</span>
          </div>
        </div>
      </div>

      {/* ACTIVITY COMPLETED CELEBRATION MODAL */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-green-500/30 text-center flex flex-col items-center gap-4 animate-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-3xl shadow-lg">
              🎉
            </div>
            <h3 className="font-display font-extrabold text-xl text-brown-900">
              You Did It, Alex!
            </h3>
            <p className="text-xs text-brown-700">
              Kamu berhasil mencapai target aktivitas harian 1.200 poin! Zyba Score kamu meningkat +5 poin hari ini.
            </p>
            <button
              onClick={() => setIsCompleted(false)}
              className="mt-2 w-full py-3 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-500 transition-colors"
            >
              Lanjutkan →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
