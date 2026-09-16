"use client";

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
}

export default function ChatMessages({
  messages,
  isSending,
  selectedModel,
  messagesEndRef,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gradient-to-b from-cream/20 to-white">
      {messages.map((msg) => {
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
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"/>
          Zyba Companion ({selectedModel}) sedang berpikir...
        </div>
      )}

      <div ref={messagesEndRef}/>
    </div>
  );
}
