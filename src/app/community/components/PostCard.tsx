"use client";

import { useState } from "react";

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  isVerified: boolean;
  time: string;
  content: string;
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  repostsCount?: number;
  userLiked: boolean;
  userReposted?: boolean;
  tag: string;
  comments?: CommentItem[];
}

interface PostCardProps {
  post: Post;
  onToggleLike: (id: string) => void;
  onToggleRepost?: (id: string) => void;
  onAddComment?: (postId: string, commentText: string) => void;
}

export default function PostCard({
  post,
  onToggleLike,
  onToggleRepost,
  onAddComment,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showShareToast, setShowShareToast] = useState(false);

  // Render hashtag dengan styling text-orange-500 (11.3)
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span
            key={index}
            className="text-orange-500 font-semibold hover:underline cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    if (onAddComment) {
      onAddComment(post.id, commentInput.trim());
    }
    setCommentInput("");
  };

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  return (
    <article className="py-5 border-b border-brown-900/10 hover:bg-cream/15 transition-colors px-1">
      {/* 11.3 Header: Avatar, Nama, Verified badge hijau, Waktu, Menu */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cream border border-brown-900/10 text-brown-900 font-display font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {post.avatar}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm text-brown-900">
                {post.author}
              </span>
              {/* Badge Centang Hijau Resmi (11.3: green-500 bukan biru) */}
              {post.isVerified && (
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-500 text-[10px] font-extrabold"
                  title="Terverifikasi ZYBA"
                >
                  ✓
                </span>
              )}
            </div>
            <span className="text-xs text-brown-700/80 font-medium">
              {post.time}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-pill bg-cream text-brown-700 border border-brown-900/10">
            #{post.tag.toLowerCase()}
          </span>
          <button
            type="button"
            className="text-brown-700/60 hover:text-brown-900 p-1 text-sm"
            title="Menu lainnya"
          >
            •••
          </button>
        </div>
      </div>

      {/* 11.3 Body: Post Text with orange-500 styled hashtags */}
      <div className="text-xs md:text-sm text-brown-900 leading-relaxed pl-13 pr-2 mb-3">
        {renderFormattedContent(post.content)}
      </div>

      {/* Media Gambar Opsional */}
      {post.mediaUrl && (
        <div className="pl-13 pr-2 mb-3">
          <img
            src={post.mediaUrl}
            alt="Media postingan"
            className="rounded-2xl max-h-72 w-full object-cover border border-brown-900/10"
          />
        </div>
      )}

      {/* 11.3 Action Row (Like, Comment, Repost, Share) */}
      <div className="flex items-center gap-6 pl-13 pt-1 text-brown-700">
        {/* Like Button: solid orange-500 saat aktif (11.3: bukan merah) */}
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            post.userLiked
              ? "text-orange-500"
              : "text-brown-700 hover:text-orange-500"
          }`}
          title="Suka"
        >
          <span className="text-base leading-none">
            {post.userLiked ? "🧡" : "🤍"}
          </span>
          <span className="text-xs">{post.likes}</span>
        </button>

        {/* Comment Button (11.4: expand inline textarea di bawah post) */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 text-xs font-semibold hover:text-brown-900 transition-colors ${
            showComments ? "text-brown-900 font-bold" : ""
          }`}
          title="Komentar"
        >
          <span className="text-base leading-none">💬</span>
          <span className="text-xs">{post.commentsCount}</span>
        </button>

        {/* Repost Button */}
        <button
          type="button"
          onClick={() => onToggleRepost && onToggleRepost(post.id)}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            post.userReposted
              ? "text-green-500"
              : "text-brown-700 hover:text-green-500"
          }`}
          title="Repost ke profilmu"
        >
          <span className="text-base leading-none">🔁</span>
          <span className="text-xs">{post.repostsCount ?? 2}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-semibold hover:text-brown-900 transition-colors"
          title="Bagikan postingan"
        >
          <span className="text-base leading-none">➤</span>
          <span className="text-xs">Bagikan</span>
        </button>
      </div>

      {/* Share Toast Feedback */}
      {showShareToast && (
        <div className="mt-2 ml-13 inline-flex items-center gap-1.5 text-[11px] bg-green-100 text-green-500 px-3 py-1 rounded-pill font-semibold">
          ✓ Tautan postingan berhasil disalin ke papan klip!
        </div>
      )}

      {/* 11.4 Inline Comment Thread (Reply langsung di feed ala Threads) */}
      {showComments && (
        <div className="mt-4 ml-13 p-4 bg-cream/40 rounded-2xl border border-brown-900/10 flex flex-col gap-3">
          {/* Daftar Komentar yang sudah ada */}
          {post.comments && post.comments.length > 0 && (
            <div className="flex flex-col gap-2.5 pb-3 border-b border-brown-900/10">
              {post.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-6 h-6 rounded-full bg-white border border-brown-900/10 flex items-center justify-center font-bold text-[10px] text-brown-900 shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 bg-white p-2.5 rounded-xl border border-brown-900/5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-brown-900 text-[11px]">
                        {c.author}
                      </span>
                      <span className="text-[10px] text-brown-700/60">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-brown-900 text-xs leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input Reply Inline */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              placeholder="Tulis balasan yang suportif..."
              className="flex-1 bg-white rounded-pill border border-brown-900/10 px-4 py-2 text-xs text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
            <button
              type="button"
              onClick={handleSendComment}
              disabled={!commentInput.trim()}
              className="rounded-pill bg-brown-900 text-white text-xs font-semibold px-4 py-2 hover:bg-orange-500 transition-colors disabled:opacity-40"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
