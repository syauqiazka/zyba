"use client";

import { useState } from "react";

interface ResourceItem {
  id: string;
  type: "ARTICLE" | "COURSE";
  title: string;
  author: string;
  duration: string;
  category: string;
  isPro: boolean;
  coverEmoji: string;
  desc: string;
}

const RESOURCES_DATA: ResourceItem[] = [
  {
    id: "r-1",
    type: "COURSE",
    title: "Mindfulness Meditation Intro",
    author: "Dr. Amanda Lee, M.Psi",
    duration: "05:55 Min",
    category: "Meditation",
    isPro: false,
    coverEmoji: "🧘‍♀️",
    desc: "Panduan audio pernapasan mendalam untuk meredakan ketegangan fisik dan pikiran yang dipenuhi beban akademik.",
  },
  {
    id: "r-2",
    type: "ARTICLE",
    title: "What is Life? Why Overthinking Occurs?",
    author: "Zyba Wellness Team",
    duration: "4 Min Read",
    category: "Psychology",
    isPro: false,
    coverEmoji: "📖",
    desc: "Memahami mekanisme biologis otak saat menghadapi ketidakpastian dan cara mengalihkan fokus ke momen saat ini.",
  },
  {
    id: "r-3",
    type: "COURSE",
    title: "Deep Sleep & Insomnia Recovery",
    author: "Sleep Specialist Inst.",
    duration: "12:00 Min",
    category: "Sleep",
    isPro: true,
    coverEmoji: "🌙",
    desc: "Teknik gelombang suara Alpha untuk membantu otak masuk ke fase tidur lelap (Deep Sleep) secara alami.",
  },
  {
    id: "r-4",
    type: "ARTICLE",
    title: "Navigating Gen Z Academic Pressure",
    author: "Prof. Handoko",
    duration: "6 Min Read",
    category: "Academic",
    isPro: true,
    coverEmoji: "🎓",
    desc: "Strategi manajemen waktu dan teknik Pomodoro adaptif yang dirancang khusus untuk ritme kerja mahasiswa.",
  },
];

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ARTICLE" | "COURSE">("ALL");
  const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);

  const filteredResources = RESOURCES_DATA.filter(
    (r) => activeFilter === "ALL" || r.type === activeFilter
  );

  const handleOpenResource = (r: ResourceItem) => {
    if (r.isPro) {
      setShowPaywallModal(true);
    } else {
      setActiveResource(r);
      setIsAudioPlaying(false);
      setCourseCompleted(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold uppercase tracking-wider">
              Our Resources
            </span>
            <span className="text-xs text-brown-700">Mindful Audio & Articles</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Mindful Resources That Make You Happy
          </h1>
          <p className="text-xs text-brown-700 mt-1 max-w-xl">
            Perluas wawasan dan tenangkan pikiran dengan koleksi artikel ilmu psikologi dan audio meditasi dari pakar terpercaya.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-cream p-1.5 rounded-2xl border border-brown-900/10">
          {[
            { id: "ALL", label: "Semua" },
            { id: "ARTICLE", label: "Artikel 📖" },
            { id: "COURSE", label: "Audio Courses 🎧" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? "bg-brown-900 text-white shadow-sm"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid (Multi-Column Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenResource(item)}
            className="glass-card glass-card-hover rounded-3xl p-6 border border-brown-900/10 cursor-pointer flex flex-col justify-between bg-white group relative overflow-hidden"
          >
            {item.isPro && (
              <span className="absolute top-4 right-4 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-sm">
                PRO ⚡
              </span>
            )}

            <div>
              <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                {item.coverEmoji}
              </div>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                {item.category} • {item.duration}
              </span>
              <h3 className="font-display font-bold text-base text-brown-900 mt-1 group-hover:text-orange-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-brown-700 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-brown-900/10 text-xs font-bold text-brown-900">
              <span className="text-brown-700 font-medium">Oleh {item.author}</span>
              <span className="text-orange-500 group-hover:translate-x-1 transition-transform">
                {item.type === "COURSE" ? "Mulai Audio →" : "Baca Artikel →"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* RESOURCE PLAYER / DETAIL MODAL */}
      {activeResource && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-brown-900/10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-500">
                {activeResource.type} • {activeResource.duration}
              </span>
              <button
                onClick={() => setActiveResource(null)}
                className="text-xs font-bold text-brown-700 hover:text-brown-900 p-1"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cream text-4xl flex items-center justify-center shrink-0">
                {activeResource.coverEmoji}
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xl text-brown-900">
                  {activeResource.title}
                </h3>
                <span className="text-xs text-brown-700">Penulis: {activeResource.author}</span>
              </div>
            </div>

            {/* Audio Player State if COURSE */}
            {activeResource.type === "COURSE" ? (
              <div className="bg-cream p-6 rounded-2xl border border-brown-900/10 flex flex-col items-center gap-4 text-center">
                <span className="text-xs font-bold text-brown-900">
                  {isAudioPlaying ? "🎵 Playing: Mindfulness Meditation Intro" : "Sesi Audio Siap Diputar"}
                </span>
                <span className="font-display text-4xl font-extrabold text-brown-900">
                  {isAudioPlaying ? "05:55" : "00:00"}
                </span>

                <div className="w-full h-2 rounded-full bg-white overflow-hidden border border-brown-900/10">
                  <div className={`h-full bg-green-500 transition-all ${isAudioPlaying ? "w-full duration-10000" : "w-0"}`} />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                    className="px-6 py-2.5 rounded-full bg-brown-900 text-white font-bold text-xs hover:bg-orange-500 transition-colors shadow-md"
                  >
                    {isAudioPlaying ? "⏸️ Jeda Audio" : "▶️ Putar Audio"}
                  </button>
                  <button
                    onClick={() => {
                      setIsAudioPlaying(false);
                      setCourseCompleted(true);
                    }}
                    className="px-4 py-2.5 rounded-full bg-green-500 text-white font-bold text-xs hover:bg-brown-900 transition-colors"
                  >
                    Selesaikan Sesi ✓
                  </button>
                </div>
              </div>
            ) : (
              /* Article Body Text */
              <div className="text-xs text-brown-900 leading-relaxed bg-cream/40 p-4 rounded-2xl border border-brown-900/10 max-h-[220px] overflow-y-auto">
                <p className="mb-3">
                  Pikiran berlebih (overthinking) terjadi ketika amigdala merespons potensi ancaman masa depan dengan mengaktifkan hormon stres kortisol.
                </p>
                <p>
                  Dengan melatih kesadaran penuh (mindfulness), kita dapat mengaktifkan korteks prefrontal untuk memproses emosi secara rasional dan menghentikan lingkaran kecemasan.
                </p>
              </div>
            )}

            {/* Course Completed Celebration */}
            {courseCompleted && (
              <div className="p-4 rounded-2xl bg-green-100 border border-green-500/30 text-center flex flex-col items-center gap-2">
                <span className="text-2xl">🎉</span>
                <span className="text-xs font-bold text-brown-900">Course Completed!</span>
                <span className="text-[10px] text-brown-700">Zyba Score kamu meningkat +10 poin!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRO PAYWALL MODAL */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-500/30 text-center flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center text-3xl shadow-lg">
              ✨
            </div>
            <h3 className="font-display font-extrabold text-xl text-brown-900">
              Unlock Full Course with Zyba Plus
            </h3>
            <p className="text-xs text-brown-700">
              Materi premium ini hanya tersedia untuk pengguna Zyba Plus. Dapatkan akses tak terbatas ke seluruh materi audio dan latihan interaktif.
            </p>
            <button
              onClick={() => {
                alert("Selamat! Kamu mengaktifkan Zyba Plus.");
                setShowPaywallModal(false);
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-xs shadow-md hover:opacity-95"
            >
              Upgrade to Zyba Plus →
            </button>
            <button
              onClick={() => setShowPaywallModal(false)}
              className="text-xs font-bold text-brown-700 hover:underline"
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
