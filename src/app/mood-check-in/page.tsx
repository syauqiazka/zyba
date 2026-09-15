"use client";

import { useState } from "react";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";

const MOODS = [
  { value: "DEPRESSED", label: "Depressed", emoji: "😞", bg: "#A99BE0", text: "text-white" },
  { value: "SAD", label: "Sad", emoji: "🙁", bg: "#EE8A5E", text: "text-white" },
  { value: "NEUTRAL", label: "Neutral", emoji: "😐", bg: "#6B5645", text: "text-white" },
  { value: "HAPPY", label: "Happy", emoji: "🙂", bg: "#E8C24A", text: "text-brown-900" },
  { value: "OVERJOYED", label: "Overjoyed", emoji: "😄", bg: "#8FAE5D", text: "text-white" },
] as const;

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  flaggedForRisk?: boolean;
}

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: "j-1",
    title: "Selesai Presentasi Proyek",
    content: "Hari ini presentasi berjalan lancar meskipun sempat deg-degan. Tim memberikan feedback positif!",
    mood: "HAPPY",
    date: "15 Sep 2026",
  },
  {
    id: "j-2",
    title: "Istirahat Sejenak dari Layar",
    content: "Jalan santai di taman kampus selama 20 menit membantu menjernihkan pikiran.",
    mood: "OVERJOYED",
    date: "14 Sep 2026",
  },
];

export default function MoodCheckInPage() {
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[number]>(MOODS[3]); // Happy default
  const [stressRating, setStressRating] = useState<number>(2);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalList, setJournalList] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);

  const handleSaveCheckIn = () => {
    if (!journalTitle.trim() && !journalContent.trim()) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      return;
    }

    const isRisk = detectRisk(journalContent);
    if (isRisk) {
      setCrisisAlert(true);
    }

    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      title: journalTitle || "Entri Mood Harian",
      content: journalContent,
      mood: selectedMood.value,
      date: "Hari Ini",
      flaggedForRisk: isRisk,
    };

    setJournalList([newEntry, ...journalList]);
    setJournalTitle("");
    setJournalContent("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Dynamic Background Banner based on Selected Mood */}
      <div
        style={{ backgroundColor: selectedMood.bg }}
        className="rounded-3xl p-8 text-white transition-colors duration-500 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner">
            {selectedMood.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                Mood Edit Active
              </span>
              <span className="text-xs opacity-80">15 Sep 2026</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">
              Kondisimu: {selectedMood.label}
            </h1>
            <p className="text-xs opacity-90 mt-1 max-w-lg">
              Perubahan suasana hati adalah hal yang wajar. Mencatatnya membantu Zyba memberikan saran relaksasi yang tepat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider">Journal Streak</span>
            <span className="text-xl font-display font-extrabold">34 / 365 Hari</span>
          </div>
          <span className="text-3xl">🔥</span>
        </div>
      </div>

      {/* Main Grid: Mood Selector & Stress Rating Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Mood & Stress Input */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col gap-6">
          <div>
            <h2 className="font-display text-lg font-bold text-brown-900 mb-1">
              1. Pilih Suasana Hati Saat Ini
            </h2>
            <p className="text-xs text-brown-700">
              Pilih 1 dari 5 skala emosi di bawah ini.
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {MOODS.map((m) => {
              const isSelected = selectedMood.value === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setSelectedMood(m)}
                  style={{ backgroundColor: isSelected ? m.bg : undefined }}
                  className={`rounded-2xl py-4 flex flex-col items-center gap-2 border-2 transition-all ${
                    isSelected
                      ? `${m.text} border-brown-900 shadow-md scale-105 font-bold`
                      : "bg-cream/70 border-transparent text-brown-900 hover:border-brown-900/20"
                  }`}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-[11px] font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>

          <hr className="border-brown-900/10" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-lg font-bold text-brown-900">
                2. Tingkat Stres (1 - 5)
              </h2>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-100 text-orange-500">
                Level {stressRating}: {["Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"][stressRating - 1]}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={stressRating}
              onChange={(e) => setStressRating(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-cream rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-brown-700 font-bold mt-1">
              <span>1 - Tenang</span>
              <span>3 - Sedang</span>
              <span>5 - Kewalahan</span>
            </div>
          </div>

          <hr className="border-brown-900/10" />

          {/* Health Journal Section */}
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-bold text-brown-900">
              3. Tambah Catatan Health Journal (Opsional)
            </h2>
            <input
              type="text"
              value={journalTitle}
              onChange={(e) => setJournalTitle(e.target.value)}
              placeholder="Judul entri (misal: Selesai Ujian, Istirahat Siang...)"
              className="w-full rounded-2xl border border-brown-900/10 px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900 bg-cream/30"
            />
            <textarea
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              placeholder="Ceritakan peristiwa atau perasaanmu hari ini..."
              rows={4}
              className="w-full rounded-2xl border border-brown-900/10 p-4 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900 bg-cream/30"
            />

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                  ✓ Check-in mood & jurnal berhasil disimpan!
                </span>
              ) : (
                <span className="text-xs text-brown-700">Data tersimpan di akun ZYBA.</span>
              )}

              <button
                type="button"
                onClick={handleSaveCheckIn}
                className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs px-6 py-3 rounded-full transition-colors shadow-md"
              >
                Simpan Mood Check-In →
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Calendar & Journal History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Mood Calendar & Stats */}
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

          {/* Health Journal Entries History */}
          <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
            <h3 className="font-display text-base font-bold text-brown-900">
              Riwayat Health Journal
            </h3>

            <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
              {journalList.map((j) => (
                <div key={j.id} className="p-4 rounded-2xl bg-white border border-brown-900/10 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brown-900">{j.title}</span>
                    <span className="text-[10px] text-brown-700">{j.date}</span>
                  </div>
                  <p className="text-xs text-brown-700 leading-relaxed">{j.content}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-500">
                      Mood: {j.mood}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CRISIS ALERT MODAL */}
      {crisisAlert && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5">
            <h3 className="font-display font-extrabold text-lg text-brown-900">
              Kami Di Sini Untuk Membantu
            </h3>
            <p className="text-xs text-brown-700 leading-relaxed bg-cream p-4 rounded-2xl">
              {CRISIS_RESOURCES.message}
            </p>
            <div className="flex flex-col gap-2">
              {CRISIS_RESOURCES.hotlines.map((h, i) => (
                <div key={i} className="p-3 rounded-2xl bg-green-100/50 flex justify-between text-xs">
                  <span className="font-bold text-brown-900">{h.name}</span>
                  <span className="font-extrabold text-green-500">{h.contact}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCrisisAlert(false)}
              className="w-full py-3 rounded-2xl bg-brown-900 text-white text-xs font-bold"
            >
              Tutup & Lanjutkan →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
