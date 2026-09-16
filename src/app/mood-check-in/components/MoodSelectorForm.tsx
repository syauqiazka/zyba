"use client";

const MOODS = [
  { value: "DEPRESSED", label: "Depressed", emoji: "😞", bg: "#A99BE0", text: "text-white" },
  { value: "SAD", label: "Sad", emoji: "🙁", bg: "#EE8A5E", text: "text-white" },
  { value: "NEUTRAL", label: "Neutral", emoji: "😐", bg: "#6B5645", text: "text-white" },
  { value: "HAPPY", label: "Happy", emoji: "🙂", bg: "#E8C24A", text: "text-brown-900" },
  { value: "OVERJOYED", label: "Overjoyed", emoji: "😄", bg: "#8FAE5D", text: "text-white" },
] as const;

interface MoodSelectorFormProps {
  selectedMood: typeof MOODS[number];
  setSelectedMood: (mood: typeof MOODS[number]) => void;
  stressRating: number;
  setStressRating: (rating: number) => void;
  journalTitle: string;
  setJournalTitle: (title: string) => void;
  journalContent: string;
  setJournalContent: (content: string) => void;
  savedSuccess: boolean;
  onSave: () => void;
}

export default function MoodSelectorForm({
  selectedMood,
  setSelectedMood,
  stressRating,
  setStressRating,
  journalTitle,
  setJournalTitle,
  journalContent,
  setJournalContent,
  savedSuccess,
  onSave,
}: MoodSelectorFormProps) {
  return (
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
            onClick={onSave}
            className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs px-6 py-3 rounded-full transition-colors shadow-md"
          >
            Simpan Mood Check-In →
          </button>
        </div>
      </div>
    </div>
  );
}
