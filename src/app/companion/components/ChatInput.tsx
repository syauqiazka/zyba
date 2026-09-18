"use client";

import { useRef, useEffect } from "react";

interface Props {
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  isSending: boolean;
  isVoiceActive: boolean;
  setIsVoiceActive: (v: boolean) => void;
  selectedModel: string;
}

export default function ChatInput({
  inputText,
  setInputText,
  handleSendMessage,
  isSending,
  isVoiceActive,
  setIsVoiceActive,
  selectedModel,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-brown-900/10 bg-white sticky bottom-0 z-10">
      {/* Voice input active feedback */}
      {isVoiceActive && (
        <div className="mb-2 flex items-center justify-between bg-orange-100 text-orange-500 px-4 py-2 rounded-pill text-xs animate-pulse">
          <span className="font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            Mendengarkan suaramu... Ucapkan perasaanmu.
          </span>
          <button
            type="button"
            onClick={() => setIsVoiceActive(false)}
            className="text-xs font-bold underline"
          >
            Selesai
          </button>
        </div>
      )}

      {/* 10.4 Rounded-pill input full-width with attachment & voice icons on the left, orange-500 circle send button */}
      <div className="relative flex items-center w-full bg-cream/70 rounded-pill border border-brown-900/15 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:bg-white transition-all pl-3 pr-2 py-1.5 shadow-xs">
        {/* Attachment Icon */}
        <button
          type="button"
          className="p-2 text-brown-700 hover:text-brown-900 hover:bg-cream rounded-full transition-colors text-sm"
          title="Lampiran dokumen / foto"
          aria-label="Lampiran"
        >
          📎
        </button>

        {/* Voice/Mic Icon */}
        <button
          type="button"
          onClick={() => setIsVoiceActive(!isVoiceActive)}
          className={`p-2 rounded-full transition-colors text-sm ${
            isVoiceActive
              ? "text-orange-500 bg-orange-100"
              : "text-brown-700 hover:text-brown-900 hover:bg-cream"
          }`}
          title="Voice input"
          aria-label="Voice input"
        >
          🎙️
        </button>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan ke Zyba..."
          disabled={isSending}
          className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/60 focus:outline-none"
        />

        {/* Circular Send Button (10.4: lingkaran orange-500, ikon panah putih, disabled abu-abu) */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isSending}
          aria-label="Kirim Pesan"
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm ${
            inputText.trim() && !isSending
              ? "bg-orange-500 text-white hover:opacity-95 hover:scale-105 active:scale-95"
              : "bg-brown-900/20 text-white/70 cursor-not-allowed"
          }`}
        >
          <span className="text-sm font-bold">→</span>
        </button>
      </div>
    </div>
  );
}
