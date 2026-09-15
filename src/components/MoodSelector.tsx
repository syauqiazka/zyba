"use client";

import { useState } from "react";

const MOODS = [
  { value: "DEPRESSED", label: "Depressed", emoji: "😞", colorClass: "bg-mood-depressed" },
  { value: "SAD", label: "Sad", emoji: "🙁", colorClass: "bg-mood-sad" },
  { value: "NEUTRAL", label: "Neutral", emoji: "😐", colorClass: "bg-mood-neutral" },
  { value: "HAPPY", label: "Happy", emoji: "🙂", colorClass: "bg-mood-happy" },
  { value: "OVERJOYED", label: "Overjoyed", emoji: "😄", colorClass: "bg-mood-overjoyed" },
] as const;

export default function MoodSelector() {
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit() {
    if (!selected) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selected, note }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-brown-900/10 max-w-xl">
      <h2 className="font-display text-lg font-semibold mb-1">
        Bagaimana perasaanmu hari ini?
      </h2>
      <p className="text-sm text-brown-700 mb-6">
        Pilih mood yang paling mendekati kondisimu sekarang.
      </p>

      <div className="flex gap-3 mb-6">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setSelected(m.value)}
            className={`flex-1 rounded-xl py-4 flex flex-col items-center gap-2 border-2 transition-all ${
              selected === m.value
                ? `${m.colorClass} border-brown-900 text-white`
                : "border-transparent bg-cream hover:border-brown-900/20"
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-xs font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Mau cerita lebih lanjut? (opsional)"
        className="w-full rounded-xl border border-brown-900/10 p-3 text-sm mb-4 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selected || status === "saving"}
        className="rounded-pill bg-brown-900 text-white px-6 py-2.5 text-sm font-medium disabled:opacity-40"
      >
        {status === "saving" ? "Menyimpan..." : "Set Mood →"}
      </button>

      {status === "saved" && (
        <p className="text-green-500 text-sm mt-3">Mood berhasil dicatat.</p>
      )}
      {status === "error" && (
        <p className="text-danger text-sm mt-3">
          Gagal menyimpan, coba lagi ya.
        </p>
      )}
    </div>
  );
}
