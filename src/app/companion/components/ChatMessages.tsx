"use client";

import { useState } from "react";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  flaggedForRisk?: boolean;
  modelUsed?: string;
  time: string;
}

interface Props {
  messages: Message[];
  isSending: boolean;
  selectedModel: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onSelectPromptStarter?: (prompt: string) => void;
}

const PROMPT_STARTERS = [
  { icon: "📚", text: "Aku lagi stres tugas kuliah dan deadline" },
  { icon: "☕", text: "Butuh teman ngobrol aja yang santai" },
  { icon: "🌙", text: "Susah tidur nyenyak akhir-akhir ini" },
  { icon: "🌿", text: "Bagaimana cara meredakan cemas mendadak?" },
];

export default function ChatMessages({
  messages,
  isSending,
  selectedModel,
  messagesEndRef,
  onSelectPromptStarter,
}: Props) {
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  // 10.3 Empty State / Intro State jika percakapan belum memiliki pesan
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-cream/30 to-white">
        {/* Mascot Illustration */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-3xl bg-cream border border-orange-500/20 shadow-md">
          <div className="absolute w-7 h-7 rounded-full bg-orange-500 -top-1 left-1/2 -translate-x-1/2 opacity-90" />
          <div className="absolute w-7 h-7 rounded-full bg-green-500 -bottom-1 left-1/2 -translate-x-1/2 opacity-90" />
          <div className="absolute w-7 h-7 rounded-full bg-orange-500 -left-1 top-1/2 -translate-y-1/2 opacity-90" />
          <div className="absolute w-7 h-7 rounded-full bg-green-500 -right-1 top-1/2 -translate-y-1/2 opacity-90" />
          <div className="w-5 h-5 rounded-full bg-brown-900 z-10 flex items-center justify-center text-[10px] text-white font-bold">
            Z
          </div>
        </div>

        <h3 className="font-display font-extrabold text-2xl text-brown-900">
          Cerita apa hari ini?
        </h3>
        <p className="mt-2 text-sm text-brown-700 max-w-md leading-relaxed">
          Ruang aman untuk mencurahkan pikiran dan perasaanmu tanpa dihakimi. Mulai obrolan dengan mengetik pesan atau pilih topik di bawah ini:
        </p>

        {/* Prompt Starter Chips (10.3) */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-lg">
          {PROMPT_STARTERS.map((starter, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectPromptStarter && onSelectPromptStarter(starter.text)}
              className="rounded-pill bg-orange-100 text-brown-900 text-xs font-semibold px-4 py-2.5 hover:bg-orange-500 hover:text-white transition-all shadow-sm flex items-center gap-2 border border-orange-500/10 active:scale-95"
            >
              <span>{starter.icon}</span>
              <span>{starter.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-gradient-to-b from-cream/20 to-white">
      {messages.map((msg, index) => {
        const isUser = msg.role === "USER";
        const isLast = index === messages.length - 1;
        const showTimestamp = isLast || hoveredMessageId === msg.id;

        return (
          <div
            key={msg.id}
            onMouseEnter={() => setHoveredMessageId(msg.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
            className={`flex items-end gap-2.5 max-w-[85%] md:max-w-[75%] ${
              isUser ? "self-end flex-row-reverse" : "self-start flex-row"
            }`}
          >
            {/* Avatar Maskot kecil di kiri bubble AI (10.2) */}
            {!isUser && (
              <div className="w-7 h-7 rounded-xl bg-cream border border-orange-500/20 shrink-0 flex items-center justify-center relative shadow-xs mb-1">
                <div className="w-2 h-2 rounded-full bg-orange-500 absolute -top-0.5" />
                <div className="w-2 h-2 rounded-full bg-green-500 absolute -bottom-0.5" />
                <div className="w-1.5 h-1.5 rounded-full bg-brown-900 z-10" />
              </div>
            )}

            <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
              {/* Bubble Chat (10.2) */}
              <div
                className={`p-4 text-xs md:text-sm leading-relaxed ${
                  isUser
                    ? "bg-brown-900 text-white rounded-2xl rounded-br-sm shadow-sm"
                    : "bg-white text-brown-900 rounded-2xl rounded-tl-sm border border-brown-900/10 shadow-xs"
                }`}
              >
                {msg.content}
              </div>

              {/* Timestamp saat hover atau pesan terakhir (10.2) */}
              <div
                className={`mt-1 flex items-center gap-2 text-[10px] text-brown-700 transition-opacity ${
                  showTimestamp ? "opacity-100" : "opacity-0"
                }`}
              >
                <span>{msg.time}</span>
                {msg.modelUsed && !isUser && (
                  <span className="text-[9px] bg-cream px-1.5 py-0.5 rounded border border-brown-900/10 text-brown-700 font-medium">
                    {msg.modelUsed}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing Indicator AI (10.2) */}
      {isSending && (
        <div className="self-start flex items-center gap-2.5 max-w-[85%]">
          <div className="w-7 h-7 rounded-xl bg-cream border border-orange-500/20 shrink-0 flex items-center justify-center relative shadow-xs">
            <div className="w-2 h-2 rounded-full bg-orange-500 absolute -top-0.5" />
            <div className="w-2 h-2 rounded-full bg-green-500 absolute -bottom-0.5" />
            <div className="w-1.5 h-1.5 rounded-full bg-brown-900 z-10" />
          </div>

          <div className="bg-white border border-brown-900/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-brown-900/40 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-brown-900/40 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-brown-900/40 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
