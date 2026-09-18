"use client";

import { useState, useRef, useEffect } from "react";
import { AIModelType } from "@/backend/ai/aiModelManager";
import ConversationList from "./components/ConversationList";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import ModelSelector from "./components/ModelSelector";
import CrisisBanner from "./components/CrisisBanner";

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
    emotionTag: "Tenang",
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
    emotionTag: "Reflektif",
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

  // Modals & Banners
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
  }, [activeConv?.messages, isSending]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isSending) return;

    setInputText("");
    setIsSending(true);

    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newUserMsg: Message = {
      id: `m-${Date.now()}`,
      role: "USER",
      content: textToSend,
      time: timeNow,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          const isFirstMessage = c.messages.length === 0;
          return {
            ...c,
            title: isFirstMessage ? textToSend.slice(0, 32) : c.title,
            lastMsg: textToSend,
            time: "Baru saja",
            messages: [...c.messages, newUserMsg],
          };
        }
        return c;
      })
    );

    try {
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          model: selectedModel,
          communicationStyle: commStyle,
          history: activeConv?.messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      // 10.5 Banner krisis jika detectRisk terpicu
      if (data.isRisk) {
        setCrisisAlert(true);
      }

      const newBotMsg: Message = {
        id: `m-${Date.now() + 1}`,
        role: "ASSISTANT",
        content: data.reply || "Terima kasih sudah berbagi. Zyba di sini mendengarkan ceritamu.",
        flaggedForRisk: data.isRisk,
        modelUsed: data.modelUsed || selectedModel,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMsg: data.reply || textToSend,
              emotionTag: data.emotionTag || c.emotionTag || "Tenang",
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
      lastMsg: "Belum ada pesan",
      time: "Baru saja",
      emotionTag: "Tenang",
      messages: [], // Empty state (10.3) dengan prompt starter
    };

    setConversations([newChat, ...conversations]);
    setActiveConvId(newId);
  };

  const handleDeleteChat = () => {
    const remaining = conversations.filter((c) => c.id !== activeConvId);
    if (remaining.length === 0) {
      const freshChat: Conversation = {
        id: `conv-${Date.now()}`,
        title: "Percakapan Baru",
        lastMsg: "Belum ada pesan",
        time: "Baru saja",
        emotionTag: "Tenang",
        messages: [],
      };
      setConversations([freshChat]);
      setActiveConvId(freshChat.id);
    } else {
      setConversations(remaining);
      setActiveConvId(remaining[0].id);
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-6rem)] min-h-[600px]">
      {/* Page Header with Multi-Model AI Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brown-900 flex items-center gap-2">
            Zyba Companion{" "}
            <span className="text-xs bg-orange-500 text-white font-bold px-2.5 py-0.5 rounded-full">
              Multi-Model AI
            </span>
          </h1>
          <p className="text-xs text-brown-700">
            Pendamping emosional cerdas untuk mendengarkan curhat, memberi insight, dan membantu menenangkan pikiran.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />

          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="px-3.5 py-2 rounded-full border border-brown-900/15 bg-white text-xs font-bold text-brown-700 hover:bg-cream transition-colors flex items-center gap-1.5 shadow-xs"
          >
            ⚙️ Gaya: {commStyle}
          </button>
          <button
            type="button"
            onClick={() => setShowProModal(true)}
            className="px-4 py-2 rounded-full bg-orange-500 text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            ⚡ Zyba Plus
          </button>
        </div>
      </div>

      {/* 10.1 Main 2-Panel Chat Layout */}
      <div className="flex-1 flex flex-col lg:flex-row bg-white rounded-3xl border border-brown-900/10 overflow-hidden shadow-sm min-h-0">
        {/* Left Panel: Conversation List (≈320px fixed) */}
        <ConversationList
          conversations={conversations}
          activeConvId={activeConvId}
          setActiveConvId={setActiveConvId}
          handleCreateNewChat={handleCreateNewChat}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedModel={selectedModel}
        />

        {/* Right Panel (flex-1): Active Chat Window */}
        <div className="flex-1 flex flex-col justify-between bg-white min-w-0">
          <ChatHeader
            activeConv={activeConv}
            selectedModel={selectedModel}
            commStyle={commStyle}
            setShowSettingsModal={setShowSettingsModal}
            setShowDeleteModal={setShowDeleteModal}
          />

          {/* 10.5 Banner Krisis Tenang (di atas jendela chat, tidak auto-dismiss) */}
          {crisisAlert && (
            <CrisisBanner onClose={() => setCrisisAlert(false)} />
          )}

          {/* 10.2 Bubble Chat & 10.3 Empty/Intro State */}
          <ChatMessages
            messages={activeConv?.messages || []}
            isSending={isSending}
            selectedModel={selectedModel}
            messagesEndRef={messagesEndRef}
            onSelectPromptStarter={(prompt) => handleSendMessage(prompt)}
          />

          {/* 10.4 Sticky Rounded-Pill Input Area */}
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            handleSendMessage={() => handleSendMessage()}
            isSending={isSending}
            isVoiceActive={isVoiceActive}
            setIsVoiceActive={setIsVoiceActive}
            selectedModel={selectedModel}
          />
        </div>
      </div>

      {/* 10.1 Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-brown-900">
                Pengaturan Zyba Companion
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-brown-700 hover:text-brown-900 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brown-900">Gaya Komunikasi AI:</label>
              {(["CASUAL", "FORMAL", "FUN"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
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
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-pill bg-orange-500 text-white text-xs font-bold hover:bg-brown-900 transition-colors"
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      )}

      {/* 10.6 State Out of Chat Limit / Upgrade Zyba Plus Modal */}
      {showProModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-orange-100 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-500/20 flex flex-col items-center text-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center text-2xl shadow-md">
              ⚡
            </div>

            <div>
              <h3 className="font-display font-extrabold text-xl text-brown-900">
                Kuota Chat Harian Habis
              </h3>
              <p className="text-xs text-brown-700 mt-1 max-w-xs leading-relaxed">
                Kamu telah mencapai batas obrolan gratis hari ini. Buka batas percakapan tanpa limit dan akses AI premium dengan Zyba Plus.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Fitur Zyba Plus segera hadir!");
                setShowProModal(false);
              }}
              className="w-full py-3.5 rounded-pill bg-orange-500 text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
            >
              Upgrade ke Zyba Plus →
            </button>

            <button
              type="button"
              onClick={() => setShowProModal(false)}
              className="text-xs font-semibold text-brown-700 hover:text-brown-900 hover:underline"
            >
              Nanti saja
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-brown-900/10 flex flex-col gap-4">
            <h3 className="font-display font-extrabold text-base text-brown-900">
              Hapus Percakapan Ini?
            </h3>
            <p className="text-xs text-brown-700">
              Semua riwayat obrolan dalam topik ini akan dihapus secara permanen.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-pill border border-brown-900/15 text-xs font-bold text-brown-700 hover:bg-cream"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteChat}
                className="flex-1 py-2.5 rounded-pill bg-danger text-white text-xs font-bold hover:opacity-90"
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
