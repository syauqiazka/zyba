"use client";

interface CreatePostModalProps {
  open: boolean;
  newPostContent: string;
  selectedTag: string;
  onContentChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CreatePostModal({
  open,
  newPostContent,
  selectedTag,
  onContentChange,
  onTagChange,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-brown-900/10 flex flex-col gap-4">
        <h3 className="font-display font-extrabold text-base text-brown-900">
          Buat Postingan Baru
        </h3>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-brown-900">Topik:</label>
          <select
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="bg-cream border border-brown-900/10 rounded-xl px-3 py-1.5 text-xs text-brown-900 font-medium focus:outline-none"
          >
            <option value="Sharing">Sharing</option>
            <option value="Mindfulness">Mindfulness</option>
            <option value="Sleep Routine">Sleep Routine</option>
            <option value="Motivation">Motivation</option>
          </select>
        </div>

        <textarea
          value={newPostContent}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Tulis cerita atau pertanyaanmu untuk komunitas Zyba..."
          rows={5}
          className="w-full rounded-2xl border border-brown-900/10 p-4 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900 bg-cream/30"
        />

        <div className="flex items-center justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-full border border-brown-900/10 text-xs font-bold text-brown-700 hover:bg-cream"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={!newPostContent.trim()}
            className="px-6 py-2.5 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-orange-500 disabled:opacity-40 transition-colors"
          >
            Posting →
          </button>
        </div>
      </div>
    </div>
  );
}
