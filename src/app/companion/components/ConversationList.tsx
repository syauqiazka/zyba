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
  conversations: Conversation[];
  activeConvId: string;
  setActiveConvId: (id: string) => void;
  handleCreateNewChat: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedModel: string;
}

export default function ConversationList({
  conversations,
  activeConvId,
  setActiveConvId,
  handleCreateNewChat,
  searchQuery,
  setSearchQuery,
  selectedModel,
}: Props) {
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
  );
}