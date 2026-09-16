"use client";

import { useState, useEffect } from "react";
import SleepQualityCard from "./components/SleepQualityCard";
import BreathingExercise from "./components/BreathingExercise";
import ActivityTracker from "./components/ActivityTracker";
import CompletionModal from "./components/CompletionModal";

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
        <SleepQualityCard />
        <BreathingExercise
          breathingActive={breathingActive}
          setBreathingActive={setBreathingActive}
          breathingPhase={breathingPhase}
          breathTimer={breathTimer}
          setBreathTimer={setBreathTimer}
          formatTime={formatTime}
        />
      </div>

      {/* Grid Section 2: Choose Activity & Tracking Progress */}
      <ActivityTracker
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activityProgress={activityProgress}
        targetProgress={targetProgress}
        onAddProgress={handleAddProgress}
      />

      <CompletionModal isOpen={isCompleted} onClose={() => setIsCompleted(false)} />
    </div>
  );
}
