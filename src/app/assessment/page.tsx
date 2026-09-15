"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";

const STEPS = [
  { title: "Goal Kesehatan", desc: "Tujuan utama pengunaan ZYBA" },
  { title: "Profil Fisik", desc: "Gender, usia, & berat badan" },
  { title: "Mood Saat Ini", desc: "Skala ekspresi emosional" },
  { title: "Riwayat Konsultasi", desc: "Bantuan profesional medis" },
  { title: "Gejala Fisik", desc: "Indikasi fisik terkait stres" },
  { title: "Kualitas Tidur", desc: "Rating 1 - 5" },
  { title: "Level Stres", desc: "Rating 1 - 5" },
  { title: "Obat & Suplemen", desc: "Konsumsi medis saat ini" },
  { title: "Gejala Mental", desc: "Keluhan kecemasan/fokus" },
  { title: "Expression Analysis", desc: "Skrining ekspresi & teks" },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [goal, setGoal] = useState("Stress Relief & Relaxation");
  const [gender, setGender] = useState("Pria");
  const [age, setAge] = useState(21);
  const [weight, setWeight] = useState(65);
  const [mood, setMood] = useState("NEUTRAL");
  const [soughtHelp, setSoughtHelp] = useState<boolean | null>(false);
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>(["Pusing ringan", "Sulit tidur"]);
  const [sleepRating, setSleepRating] = useState(3);
  const [stressRating, setStressRating] = useState(2);
  const [medications, setMedications] = useState("Tidak ada");
  const [mentalSymptoms, setMentalSymptoms] = useState<string[]>(["Mudah lelah", "Kadang overthinking"]);
  
  // Neutralized Expression Analysis Text (Replacing sensitive suicide placeholder)
  const [expressionText, setExpressionText] = useState(
    "Akhir-akhir ini saya merasa sedikit lelah karena beban tugas kuliah menumpuk dan jam tidur berkurang. Saya ingin melatih pikiran agar lebih tenang dan bisa mengelola waktu belajar dengan baik."
  );

  const [isCompiling, setIsCompiling] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);

  const handleNext = () => {
    if (currentStep === 9) {
      // Check crisis keywords on Expression Analysis Text
      const isRisk = detectRisk(expressionText);
      if (isRisk) {
        setCrisisAlert(true);
        return;
      }

      // Trigger Compiling Data Loading State
      setIsCompiling(true);
      setTimeout(() => {
        setIsCompiling(false);
        setIsCompleted(true);
      }, 2000);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const toggleSymptom = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brown-900">
            Mental Health Assessment
          </h1>
          <p className="text-xs text-brown-700">
            Kuisioner awal untuk menyusun rencana kesehatan mental terpersonalisasi.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-500">
          Langkah {currentStep + 1} dari 10
        </span>
      </div>

      {/* Main Multi-Step Desktop Layout */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Panel: Progress Stepper */}
        <div className="col-span-4 glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
          <div className="flex flex-col gap-1 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">Progress Assessment</span>
            <div className="w-full h-2 rounded-full bg-cream overflow-hidden border border-brown-900/10">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 10) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-brown-900 text-right mt-0.5">
              {Math.round(((currentStep + 1) / 10) * 100)}%
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {STEPS.map((s, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              return (
                <div
                  key={s.title}
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer border ${
                    isActive
                      ? "bg-brown-900 text-white border-brown-900 shadow-sm"
                      : isPast
                      ? "bg-green-100/60 text-brown-900 border-green-500/30"
                      : "bg-cream/40 text-brown-700/60 border-transparent"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : isPast
                        ? "bg-green-500 text-white"
                        : "bg-brown-900/10 text-brown-700"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold truncate">{s.title}</span>
                    <span className="text-[10px] opacity-80 truncate">{s.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Active Question Card */}
        <div className="col-span-8 glass-card rounded-3xl p-8 border border-brown-900/10 flex flex-col justify-between min-h-[500px] bg-white">
          {!isCompiling && !isCompleted && (
            <>
              {/* Question Contents by Step */}
              <div className="flex flex-col gap-6">
                {currentStep === 0 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-brown-900">
                      Apa goal kesehatan utama yang ingin kamu capai di ZYBA?
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Stress Relief & Relaxation",
                        "Memperbaiki Kualitas Tidur",
                        "Meningkatkan Fokus & Produktivitas",
                        "Curhat & Konseling AI 24/7",
                      ].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGoal(g)}
                          className={`p-4 rounded-2xl text-xs font-bold border-2 transition-all text-left ${
                            goal === g
                              ? "border-orange-500 bg-orange-100 text-brown-900 shadow-sm"
                              : "border-brown-900/10 bg-cream/40 hover:border-brown-900/20 text-brown-700"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-brown-900">
                      Informasi Profil Fisik
                    </h2>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-brown-900">Gender:</label>
                      <div className="flex gap-3">
                        {["Pria", "Wanita", "Lainnya"].map((gen) => (
                          <button
                            key={gen}
                            onClick={() => setGender(gen)}
                            className={`flex-1 p-3 rounded-2xl text-xs font-bold border-2 ${
                              gender === gen ? "bg-brown-900 text-white border-brown-900" : "bg-cream border-brown-900/10 text-brown-700"
                            }`}
                          >
                            {gen}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="text-xs font-bold text-brown-900">Usia (Tahun):</label>
                          <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="w-full mt-1 bg-cream rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-brown-900">Berat Badan (kg):</label>
                          <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full mt-1 bg-cream rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-brown-900">
                      Bagaimana kondisi suasana hatimu secara umum?
                    </h2>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { val: "DEPRESSED", label: "Depressed 😞" },
                        { val: "SAD", label: "Sad 🙁" },
                        { val: "NEUTRAL", label: "Neutral 😐" },
                        { val: "HAPPY", label: "Happy 🙂" },
                        { val: "OVERJOYED", label: "Overjoyed 😄" },
                      ].map((m) => (
                        <button
                          key={m.val}
                          onClick={() => setMood(m.val)}
                          className={`p-4 rounded-2xl text-xs font-bold border-2 ${
                            mood === m.val ? "bg-brown-900 text-white border-brown-900" : "bg-cream border-brown-900/10 text-brown-700"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-brown-900">
                      Pernah mencari bantuan profesional (Psikolog / Psikiater)?
                    </h2>
                    <div className="flex gap-4">
                      {[
                        { label: "Ya, Pernah Konsultasi", val: true },
                        { label: "Belum Pernah", val: false },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setSoughtHelp(opt.val)}
                          className={`flex-1 p-5 rounded-2xl text-xs font-bold border-2 ${
                            soughtHelp === opt.val ? "bg-brown-900 text-white border-brown-900" : "bg-cream border-brown-900/10 text-brown-700"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-brown-900">
                      Gejala fisik yang sering kamu alami saat cemas/stres:
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Pusing / Sakit Kepala",
                        "Sulit Tidur / Insomnia",
                        "Jantung Berdebar Kencang",
                        "Sesak Napas Ringan",
                        "Tubuh Terasa Lemah",
                        "Nyeri Otot / Leher Kaku",
                      ].map((sym) => {
                        const isSel = physicalSymptoms.includes(sym);
                        return (
                          <button
                            key={sym}
                            onClick={() => toggleSymptom(physicalSymptoms, setPhysicalSymptoms, sym)}
                            className={`p-3.5 rounded-2xl text-xs font-bold border-2 text-left transition-all ${
                              isSel ? "bg-green-500 text-white border-green-500" : "bg-cream border-brown-900/10 text-brown-700"
                            }`}
                          >
                            {isSel ? "✓ " : "+ "} {sym}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-brown-900">
                      Rating Kualitas Tidur (1 - 5)
                    </h2>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={sleepRating}
                      onChange={(e) => setSleepRating(Number(e.target.value))}
                      className="w-full accent-green-500 cursor-pointer h-2 bg-cream rounded-lg my-4"
                    />
                    <div className="flex justify-between text-xs font-bold text-brown-900">
                      <span>1 - Sangat Buruk</span>
                      <span className="text-green-500">Rating: {sleepRating} / 5</span>
                      <span>5 - Nyenyak Sekali</span>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-brown-900">
                      Rating Level Stres Harian (1 - 5)
                    </h2>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stressRating}
                      onChange={(e) => setStressRating(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer h-2 bg-cream rounded-lg my-4"
                    />
                    <div className="flex justify-between text-xs font-bold text-brown-900">
                      <span>1 - Sangat Santai</span>
                      <span className="text-orange-500">Rating: {stressRating} / 5</span>
                      <span>5 - Sangat Tertekan</span>
                    </div>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-brown-900">
                      Obat atau Suplemen yang Sedang Dikonsumsi:
                    </h2>
                    <input
                      type="text"
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      placeholder="Misal: Suplemen Vitamin D, obat tidur, dll (atau 'Tidak Ada')"
                      className="w-full bg-cream rounded-2xl border border-brown-900/10 p-4 text-xs font-bold text-brown-900 focus:outline-none"
                    />
                  </div>
                )}

                {currentStep === 8 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-brown-900">
                      Gejala kesehatan mental yang paling sering dirasakan:
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Kecemasan Berlebih (Anxiety)",
                        "Perubahan Mood Mendadak",
                        "Sulit Berfokus saat Belajar/Kerja",
                        "Rasa Lelah Mental Berkelanjutan",
                      ].map((sym) => {
                        const isSel = mentalSymptoms.includes(sym);
                        return (
                          <button
                            key={sym}
                            onClick={() => toggleSymptom(mentalSymptoms, setMentalSymptoms, sym)}
                            className={`p-3.5 rounded-2xl text-xs font-bold border-2 text-left transition-all ${
                              isSel ? "bg-orange-500 text-white border-orange-500" : "bg-cream border-brown-900/10 text-brown-700"
                            }`}
                          >
                            {isSel ? "✓ " : "+ "} {sym}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {currentStep === 9 && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl font-bold text-brown-900">
                        AI Expression & Reflection Screening
                      </h2>
                      <span className="text-[10px] bg-green-100 text-green-500 font-bold px-2 py-0.5 rounded-full">
                        Keamanan Konten Terverifikasi
                      </span>
                    </div>

                    <p className="text-xs text-brown-700">
                      Tuliskan ekspresi bebas mengenai apa yang sedang membebani pikiranmu saat ini:
                    </p>

                    <textarea
                      value={expressionText}
                      onChange={(e) => setExpressionText(e.target.value)}
                      rows={5}
                      className="w-full rounded-2xl border border-brown-900/10 p-4 text-xs font-medium text-brown-900 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-[10px] text-brown-700">
                      *Teks ini diproses secara rahasia oleh sistem Zyba AI untuk menghasilkan evaluasi skor awal.
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-brown-900/10 mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="px-6 py-3 rounded-full border border-brown-900/10 text-xs font-bold text-brown-700 hover:bg-cream disabled:opacity-30"
                >
                  ← Sebelumnya
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 rounded-full bg-brown-900 hover:bg-orange-500 text-white text-xs font-bold transition-colors shadow-md"
                >
                  {currentStep === 9 ? "Selesaikan & Hitung Skor →" : "Lanjut →"}
                </button>
              </div>
            </>
          )}

          {/* COMPILING DATA STATE */}
          {isCompiling && (
            <div className="flex flex-col items-center justify-center my-auto text-center gap-4 py-12">
              <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
              <h2 className="font-display font-extrabold text-2xl text-brown-900">
                Compiling Mental Health Metrics...
              </h2>
              <p className="text-xs text-brown-700 max-w-sm">
                Zyba AI sedang menganalisis jawabanmu untuk menghitung skor awal dan menyusun program rekomendasi harian.
              </p>
            </div>
          )}

          {/* YOU'RE ALL SET UP STATE */}
          {isCompleted && (
            <div className="flex flex-col items-center justify-center my-auto text-center gap-6 py-8 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-3xl bg-green-500 text-white font-display font-extrabold flex items-center justify-center text-4xl shadow-xl shadow-green-500/20">
                80
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-500">
                  You're All Set Up!
                </span>
                <h2 className="font-display font-extrabold text-3xl text-brown-900 mt-1">
                  Skor Awal ZYBA: 80 / 100
                </h2>
                <p className="text-xs text-brown-700 mt-2 max-w-md">
                  Profil kesehatan mentalmu telah berhasil dibuat. Kamu siap mengakses seluruh fitur Zyba Companion, Smart Activity Planner, dan Community!
                </p>
              </div>

              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-3.5 rounded-full bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                Buka Dashboard ZYBA →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CRISIS ESCALATION MODAL (Sensitive content guard) */}
      {crisisAlert && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5">
            <h3 className="font-display font-extrabold text-lg text-brown-900">
              Dukungan & Pertolongan Resmi
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
              onClick={() => {
                setCrisisAlert(false);
                setExpressionText("Saya merasa sedikit lelah dengan beban tugas, namun ingin belajar lebih tenang.");
              }}
              className="w-full py-3 rounded-2xl bg-brown-900 text-white text-xs font-bold"
            >
              Ubah Kalimat & Lanjutkan →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
