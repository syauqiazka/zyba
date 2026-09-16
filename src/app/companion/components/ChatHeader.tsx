"use client";

interface Conversation {
  id: string;
  title: string;
  lastMsg: string;
  time: string;
  emotionTag: string;
  messages: any[];
}

interface Props {
  activeConv: Conversation | undefined;
  selectedModel: string;
  commStyle: string;
  setShowDeleteModal: (v: boolean) => void;
}

export default function ChatHeader({
  activeConv,
  selectedModel,
  commStyle,
  setShowDeleteModal,
}: Props) {
  return (
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
  );
}