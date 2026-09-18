"use client";

import { useState } from "react";
import { detectRisk } from "@/lib/crisisDetection";

interface ComposeBoxProps {
  onAddPost: (content: string, tag: string, mediaUrl?: string) => void;
  onRiskDetected?: () => void;
}

const TAG_OPTIONS = ["Sharing", "Mindfulness", "Sleep Routine", "ZybaRocks", "MentalHealth", "SelfCare"];

export default function ComposeBox({ onAddPost, onRiskDetected }: ComposeBoxProps) {
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("Sharing");
  const [showTagPicker, setShowTagPicker] = useState(false);

  const handlePost = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    if (detectRisk(trimmed) && onRiskDetected) {
      onRiskDetected();
    }

    onAddPost(trimmed, selectedTag);
    setContent("");
    setShowTagPicker(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-brown-900/10 shadow-xs flex flex-col gap-3">
      {/* 11.4 Indikator Pengingat Privasi */}
      <div className="flex items-center justify-between text-[11px] text-brown-700/80 pb-2 border-b border-brown-900/5">
        <span className="flex items-center gap-1.5 font-medium">
          <span>🔒</span>
          <span>Postingan ini terlihat oleh seluruh komunitas</span>
        </span>
        <span className="text-[10px] text-brown-700/60">
          (Curhat privat? Gunakan Zyba Companion)
        </span>
      </div>

      {/* Main input row: Avatar + Textarea */}
      <div className="flex items-start gap-3 pt-1">
        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 font-display font-bold flex items-center justify-center text-xs shrink-0 border border-orange-500/20">
          AL
        </div>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ada cerita apa hari ini? Berbagi dengan ruang aman ZYBA..."
            rows={3}
            className="w-full text-xs md:text-sm text-brown-900 placeholder:text-brown-700/50 resize-none bg-transparent focus:outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* Selected Tag Pill if not default */}
      {selectedTag && (
        <div className="flex items-center gap-2 pl-12">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-orange-100 text-orange-500 px-2.5 py-0.5 rounded-pill">
            #{selectedTag.toLowerCase()}
            <button
              type="button"
              onClick={() => setSelectedTag("Sharing")}
              className="hover:text-brown-900 ml-1 text-xs"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Action Row: Attachments + Tag Picker + Post Button */}
      <div className="flex items-center justify-between pt-2 border-t border-brown-900/5 pl-12">
        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            className="p-1.5 rounded-lg text-brown-700 hover:text-brown-900 hover:bg-cream transition-colors text-sm"
            title="Tambah gambar"
          >
            📷
          </button>
          <button
            type="button"
            onClick={() => setShowTagPicker(!showTagPicker)}
            className="p-1.5 rounded-lg text-brown-700 hover:text-orange-500 hover:bg-cream transition-colors text-xs font-semibold flex items-center gap-1"
            title="Pilih Topik / Tag"
          >
            <span>🏷️</span>
            <span className="text-[11px]">Topik</span>
          </button>

          {/* Tag Dropdown */}
          {showTagPicker && (
            <div className="absolute top-8 left-0 z-20 bg-white border border-brown-900/10 rounded-2xl shadow-lg p-2.5 flex flex-wrap gap-1.5 w-60">
              {TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTag(tag);
                    setShowTagPicker(false);
                  }}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-pill transition-colors ${
                    selectedTag === tag
                      ? "bg-brown-900 text-white"
                      : "bg-cream text-brown-700 hover:bg-orange-100 hover:text-orange-500"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 11.2 Tombol Post: rounded-pill, bg-orange-500, disabled abu-abu */}
        <button
          type="button"
          onClick={handlePost}
          disabled={!content.trim()}
          className={`rounded-pill px-5 py-2 text-xs font-bold transition-all shadow-xs ${
            content.trim()
              ? "bg-orange-500 text-white hover:opacity-90 active:scale-95"
              : "bg-brown-900/20 text-white/70 cursor-not-allowed"
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
}
