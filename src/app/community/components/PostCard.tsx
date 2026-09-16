"use client";

interface Post {
  id: string;
  author: string;
  avatar: string;
  isVerified: boolean;
  time: string;
  content: string;
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  userLiked: boolean;
  tag: string;
}

interface PostCardProps {
  post: Post;
  onToggleLike: (id: string) => void;
}

export default function PostCard({ post, onToggleLike }: PostCardProps) {
  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4 bg-white">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 text-white font-display font-bold flex items-center justify-center text-xs shadow-sm">
            {post.avatar}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-brown-900">{post.author}</span>
              {post.isVerified && (
                <span className="text-[10px] bg-green-100 text-green-500 font-bold px-1.5 py-0.2 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            <span className="text-[10px] text-brown-700">{post.time}</span>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cream text-brown-900 border border-brown-900/10">
          #{post.tag}
        </span>
      </div>

      {/* Post Content */}
      <p className="text-xs text-brown-900 leading-relaxed font-body">{post.content}</p>

      {/* Interaction Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-brown-900/10 text-xs">
        <button
          onClick={() => onToggleLike(post.id)}
          className={`flex items-center gap-1.5 font-bold transition-colors ${
            post.userLiked ? "text-orange-500" : "text-brown-700 hover:text-brown-900"
          }`}
        >
          <span>{post.userLiked ? "❤️" : "🤍"}</span>
          <span>{post.likes} Suka</span>
        </button>

        <button className="flex items-center gap-1.5 font-bold text-brown-700 hover:text-brown-900">
          <span>💬</span>
          <span>{post.commentsCount} Komentar</span>
        </button>

        <button className="text-brown-700 hover:text-brown-900">
          📤 Bagikan
        </button>
      </div>
    </div>
  );
}
