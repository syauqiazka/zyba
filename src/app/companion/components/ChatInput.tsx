"use client";

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
  return (
    <div className="p-4 border-t border-brown-900/10 bg-white flex flex-col gap-2">
      {isVoiceActive && (
        <div className="flex items-center justify-between bg-orange-100 text-orange-500 p-2.5 rounded-2xl text-xs animate-pulse">
          <span className="font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"/>
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
  );
}
