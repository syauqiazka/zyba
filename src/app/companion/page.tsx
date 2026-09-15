"use client";

import { useState, useRef, useEffect } from "react";
import { CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";
import { AIModelType } from "@/backend/ai/aiModelManager";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  flaggedForRisk?: boolean;
  modelUsed?: string;
  time: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMsg: string;
  time: string;
  emotionTag: string;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Overthinking Seputar Tugas Akhir",
    lastMsg: "Terima kasih Zyba, latihan pernapasan tadi sangat membantu fokusku.",
    time: "10:45 AM",
    emotionTag: "Calming",
    messages: [
      {
        id: "m-1",
        role: "USER",
        content: "Halo Zyba, aku merasa cemas sekali memikirkan deadline tugas minggu depan.",
        time: "10:40 AM",
      },
      {
        id: "m-2",
        role: "ASSISTANT",
        content:
          "Halo Alex! Sangat wajar merasa cemas saat menghadapi banyak tugas sekaligus. Cobalah tarik napas perlahan 4 detik, tahan 4 detik, lalu hembuskan 4 detik. Mari pecah tugasmu menjadi langkah-langkah kecil yang bisa diselesaikan hari ini.",
        modelUsed: "gemini-1.5-flash",
        time: "10:41 AM",
      },
      {
        id: "m-3",
        role: "USER",
        content: "Terima kasih Zyba, latihan pernapasan tadi sangat membantu fokusku.",
        time: "10:45 AM",
      },
    ],
  },
  {
    id: "conv-2",
    title: "Evaluasi Kualitas Tidur Minggu Ini",
    lastMsg: "Cobalah mematikan gadget 30 menit sebelum tidur ya.",
    time: "Kemarin",
    emotionTag: "Reflective",
    messages: [
      {
        id: "m-4",
        role: "USER",
        content: "Belakangan ini aku baru bisa tidur jam 2 pagi. Kepala rasanya berat.",
        time: "23:15 PM",
      },
      {
        id: "m-5",
        role: "ASSISTANT",
        content:
          "Kurang tidur dapat mempengaruhi regulasi emosi dan imunitas tubuh. Cobalah mematikan gadget 30 menit sebelum tidur dan dengarkan audio relaksasi di menu Resources.",
        modelUsed: "gemini-1.5-flash",
        time: "23:16 PM",
      },
    ],
  },
];

export default function CompanionPage() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [inputText, setInputText] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [commStyle, setCommStyle] = useState<"CASUAL" | "FORMAL" | "FUN">("CASUAL");
  const [selectedModel, setSelectedModel] = useState<AIModelType>("gemini-1.5-flash");
  const [isSending, setIsSending] = useState(false);

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const userMsgText = inputText.trim();
    setInputText("");
    setIsSending(true);

    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newUserMsg: Message = {
      id: `m-${Date.now()}`,
      role: "USER",
      content: userMsgText,
      time: timeNow,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMsg: userMsgText,
            time: "Baru saja",
            messages: [...c.messages, newUserMsg],
          };
        }
        return c;
      })
    );

    try {
      // Fetch response from Backend API route with Selected AI Model
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          model: selectedModel,
          communicationStyle: commStyle,
          history: activeConv?.messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.isRisk) {
        setCrisisAlert(true);
      }

      const newBotMsg: Message = {
        id: `m-${Date.now() + 1}`,
        role: "ASSISTANT",
        content: data.reply || "Maaf, Zyba sedang memproses data.",
        flaggedForRisk: data.isRisk,
        modelUsed: data.modelUsed || selectedModel,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMsg: data.reply || userMsgText,
              emotionTag: data.emotionTag || c.emotionTag,
              messages: [...c.messages, newBotMsg],
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Error fetching companion response:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newChat: Conversation = {
      id: newId,
      title: "Percakapan Baru",
      lastMsg: "Halo! Ada yang ingin kamu ceritakan?",
      time: "Baru saja",
      emotionTag: "Neutral",
      messages: [
        {
          id: `m-${Date.now()}`,
          role: "ASSISTANT",
          content: "Halo Alex! Aku Zyba Companion. Bagaimana perasaanmu hari ini? Ceritakan apa saja yang mengganggu pikiranmu.",
          modelUsed: selectedModel,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setConversations([newChat, ...conversations]);
    setActiveConvId(newId);
  };

  const handleDeleteChat = () => {
    setConversations(conversations.filter((c) => c.id !== activeConvId));
    setShowDeleteModal(false);
    if (conversations.length > 1) {
      setActiveConvId(conversations[0].id);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-5rem)]">
      {/* Page Header with Multi-Model AI Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brown-900 flex items-center gap-2">
            Zyba Companion <span className="text-xs bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">Multi-Model AI</span>
          </h1>
          <p className="text-xs text-brown-700">
            Pilih model kecerdasan buatan favoritmu untuk pengalaman konsultasi emosional yang dipersonalisasi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Model Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-brown-900/10 rounded-full px-3 py-1 shadow-sm">
            <span className="text-xs font-bold text-brown-700">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as AIModelType)}
              className="bg-transparent text-xs font-bold text-brown-900 focus:outline-none cursor-pointer"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash ⚡</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro ✨</option>
              <option value="gpt-4o">OpenAI GPT-4o 🤖</option>
              <option value="llama-3.3-70b">Groq Llama 3.3 🦙</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet 🎨</option>
            </select>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3.5 py-1.5 rounded-full border border-brown-900/10 bg-white text-xs font-bold text-brown-700 hover:bg-cream transition-colors flex items-center gap-1.5"
          >
            ⚙️ Style: {commStyle}
          </button>
          <button
            onClick={() => setShowProModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            ⚡ Upgrade Pro
          </button>
        </div>
      </div>

      {/* Main 2-Panel Chat Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 bg-white/80 rounded-3xl border border-brown-900/10 overflow-hidden shadow-sm backdrop-blur-md">
        {/* Left Panel: Conversation History */}
        <div className="col-span-4 border-r border-brown-900/10 flex flex-col justify-between bg-cream/30">
          <div className="p-4 border-b border-brown-900/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brown-900">
                Percakapan ({conversations.length})
              </span>
              <button
                onClick={handleCreateNewChat}
                className="bg-brown-900 hover:bg-orange-500 text-cream text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 shadow-sm"
              >
                + Chat Baru
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari riwayat chat..."
                className="w-full bg-white rounded-xl border border-brown-900/10 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {filteredConversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isActive
                      ? "bg-cream border-brown-900/20 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-brown-900 truncate max-w-[160px]">
                      {conv.title}
                    </span>
                    <span className="text-[10px] text-brown-700 font-medium">{conv.time}</span>
                  </div>
                  <p className="text-[11px] text-brown-700 line-clamp-1 mb-2">{conv.lastMsg}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-500">
                      🏷️ {conv.emotionTag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-brown-900/10 bg-white/40 flex items-center justify-between text-[11px] text-brown-700">
            <span>Model Aktif: <strong className="text-brown-900">{selectedModel}</strong></span>
            <span className="font-bold text-green-500">Zyba Free Tier</span>
          </div>
        </div>

        {/* Right Panel: Active Chat Interface */}
        <div className="col-span-8 flex flex-col justify-between bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-brown-900/10 flex items-center justify-between bg-white/90 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-green-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  ZB
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-sm text-brown-900">Zyba Companion</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-500">
                    Emotion: {activeConv?.emotionTag || "Calming"}
                  </span>
                </div>
                <span className="text-[10px] text-brown-700">
                  Model: {selectedModel} • Style: {commStyle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-xl text-brown-700 hover:bg-orange-100 hover:text-danger transition-colors text-xs"
                title="Hapus Chat"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gradient-to-b from-cream/20 to-white">
            {activeConv?.messages.map((msg) => {
              const isUser = msg.role === "USER";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    isUser ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-brown-700">
                      {isUser ? "Kamu" : "Zyba Companion"}
                    </span>
                    {msg.modelUsed && (
                      <span className="text-[9px] bg-cream px-1.5 py-0.2 rounded border border-brown-900/10 text-brown-700">
                        {msg.modelUsed}
                      </span>
                    )}
                    <span className="text-[9px] text-brown-700/60">{msg.time}</span>
                  </div>

                  <div
                    className={`p-4 rounded-3xl text-xs leading-relaxed ${
                      isUser
                        ? "bg-brown-900 text-cream rounded-tr-none shadow-md shadow-brown-900/10"
                        : "bg-cream text-brown-900 rounded-tl-none border border-brown-900/10 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.flaggedForRisk && (
                    <span className="text-[10px] text-orange-500 font-bold mt-1 bg-orange-100 px-2 py-0.5 rounded-full">
                      ⚠️ Terdeteksi indikasi beban emosional berat
                    </span>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="self-start flex items-center gap-2 bg-cream/70 px-4 py-3 rounded-2xl text-xs text-brown-700 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                Zyba Companion ({selectedModel}) sedang berpikir...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-4 border-t border-brown-900/10 bg-white flex flex-col gap-2">
            {isVoiceActive && (
              <div className="flex items-center justify-between bg-orange-100 text-orange-500 p-2.5 rounded-2xl text-xs animate-pulse">
                <span className="font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  Merekam suara pengguna... Ucapkan pesanmu.
                </span>
                <button
                  onClick={() => setIsVoiceActive(false)}
                  className="text-xs font-bold underline"
                >
                  Selesai
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`p-2.5 rounded-2xl transition-colors text-sm ${
                  isVoiceActive ? "bg-orange-500 text-white" : "bg-cream text-brown-700 hover:bg-orange-100"
                }`}
                title="Voice Input"
              >
                🎙️
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Curhat ke Zyba via ${selectedModel}...`}
                className="flex-1 bg-cream/60 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isSending}
                className="bg-brown-900 text-white px-5 py-3 rounded-2xl text-xs font-bold hover:bg-orange-500 disabled:opacity-40 transition-colors shadow-sm"
              >
                {isSending ? "Mengirim..." : "Kirim →"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CRISIS ALERT MODAL */}
      {crisisAlert && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-500 font-bold flex items-center justify-center text-xl">
                🤝
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-brown-900">
                  Kami Di Sini Untukmu
                </h3>
                <span className="text-xs text-brown-700">Bantuan Resmi 24/7 Gratis</span>
              </div>
            </div>

            <p className="text-xs text-brown-700 leading-relaxed bg-cream p-4 rounded-2xl">
              {CRISIS_RESOURCES.message}
            </p>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-brown-900">Layanan Pendampingan Indonesia:</span>
              {CRISIS_RESOURCES.hotlines.map((h, i) => (
                <div key={i} className="p-3 rounded-2xl bg-green-100/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-brown-900">{h.name}</span>
                  <span className="text-xs font-extrabold text-green-500">{h.contact}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCrisisAlert(false)}
              className="mt-2 w-full py-3 rounded-2xl bg-brown-900 text-white text-xs font-bold"
            >
              Saya Mengerti & Aman →
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5">
            <h3 className="font-display font-extrabold text-base text-brown-900">
              Pengaturan Zyba Companion
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brown-900">Gaya Komunikasi AI:</label>
              {(["CASUAL", "FORMAL", "FUN"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setCommStyle(style)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-colors flex items-center justify-between ${
                    commStyle === style
                      ? "bg-brown-900 text-white border-brown-900"
                      : "bg-cream text-brown-900 border-brown-900/10 hover:border-orange-500"
                  }`}
                >
                  <span>{style}</span>
                  {commStyle === style && <span>✓</span>}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-brown-900 transition-colors"
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      )}

      {/* PRO PAYWALL MODAL */}
      {showProModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-500/30 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30">
                ✨
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-brown-900">
                  Upgrade ke Zyba Plus
                </h3>
                <span className="text-xs text-orange-500 font-bold">Unlimited AI Conversations</span>
              </div>
            </div>

            <ul className="text-xs text-brown-700 flex flex-col gap-2 bg-cream p-4 rounded-2xl">
              <li className="flex items-center gap-2">✓ Akses seluruh model AI (GPT-4o, Claude 3.5, Gemini Pro)</li>
              <li className="flex items-center gap-2">✓ Tanpa batasan token harian chat</li>
              <li className="flex items-center gap-2">✓ Bebas akses semua Course & Audio Mindfulness</li>
            </ul>

            <button
              onClick={() => {
                alert("Selamat! Akun ZYBA kamu kini aktif sebagai Zyba Plus.");
                setShowProModal(false);
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
            >
              Berlangganan Rp 29.000 / Bulan →
            </button>
            <button
              onClick={() => setShowProModal(false)}
              className="text-xs font-bold text-brown-700 hover:underline text-center"
            >
              Lanjutkan Versi Gratis
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-brown-900/10 flex flex-col gap-4">
            <h3 className="font-display font-extrabold text-base text-brown-900">
              Hapus Percakapan Ini?
            </h3>
            <p className="text-xs text-brown-700">
              Semua riwayat obrolan dalam topik ini akan dihapus secara permanen dari server.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-full border border-brown-900/10 text-xs font-bold text-brown-700 hover:bg-cream"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteChat}
                className="flex-1 py-2.5 rounded-full bg-danger text-white text-xs font-bold hover:opacity-90"
              >
                Hapus →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
