"use client";

import { useState } from "react";

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

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    author: "Sarah Jenkins",
    avatar: "SJ",
    isVerified: true,
    time: "2 jam yang lalu",
    tag: "Mindfulness",
    content: "Baru saja menyelesaikan 7 hari streak breathing exercise di Zyba! Rasanya pikiran jauh lebih tenang menghadapi ujian pekan ini. Tetap semangat semuanya! 🌿✨",
    likes: 24,
    commentsCount: 5,
    userLiked: false,
  },
  {
    id: "post-2",
    author: "Dimas Anggara",
    avatar: "DA",
    isVerified: false,
    time: "5 jam yang lalu",
    tag: "Sleep Routine",
    content: "Dulu sering begadang sampai subuh karena anxiety. Setelah ikuti rekomendasi sleep hygiene Zyba, akhirnya bisa tidur teratur jam 11 malam. Small wins count!",
    likes: 42,
    commentsCount: 12,
    userLiked: true,
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("Sharing");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            userLiked: !p.userLiked,
            likes: p.userLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: "Alex Rivera",
      avatar: "AL",
      isVerified: true,
      time: "Baru saja",
      tag: selectedTag,
      content: newPostContent,
      likes: 0,
      commentsCount: 0,
      userLiked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-gradient-to-r from-green-100/50 via-white to-cream flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold uppercase tracking-wider">
              Zyba Community
            </span>
            <span className="text-xs text-brown-700">Ruang Aman & Supportive</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Loving & Supportive Community
          </h1>
          <p className="text-xs text-brown-700 mt-1 max-w-xl">
            Berbagi pengalaman, motivasi, dan cerita perjalanan kesehatan mental bersama ribuan anggota Gen Z di seluruh Indonesia.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs px-6 py-3 rounded-full transition-colors shadow-md shrink-0 flex items-center gap-2"
        >
          ✍️ Buat Postingan Baru →
        </button>
      </div>

      {/* Main Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Posts Feed */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4 bg-white"
            >
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
                  onClick={() => handleToggleLike(post.id)}
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
          ))}
        </div>

        {/* Right Sidebar Rules & Community Guidelines */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
            <h3 className="font-display text-base font-bold text-brown-900">
              🛡️ Aturan Komunitas Zyba
            </h3>
            <ul className="text-xs text-brown-700 flex flex-col gap-2.5">
              <li className="flex items-start gap-2">
                <span>•</span> Saling menghormati dan bersikap ramah sesama anggota.
              </li>
              <li className="flex items-start gap-2">
                <span>•</span> Dilarang membagikan konten kebencian atau diskriminasi.
              </li>
              <li className="flex items-start gap-2">
                <span>•</span> Komunitas ini adalah tempat saling dukung, bukan pengganti diagnosa medis profesional.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-brown-900/10 flex flex-col gap-4">
            <h3 className="font-display font-extrabold text-base text-brown-900">
              Buat Postingan Baru
            </h3>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-brown-900">Topik:</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
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
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Tulis cerita atau pertanyaanmu untuk komunitas Zyba..."
              rows={5}
              className="w-full rounded-2xl border border-brown-900/10 p-4 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900 bg-cream/30"
            />

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-full border border-brown-900/10 text-xs font-bold text-brown-700 hover:bg-cream"
              >
                Batal
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="px-6 py-2.5 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-orange-500 disabled:opacity-40 transition-colors"
              >
                Posting →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
