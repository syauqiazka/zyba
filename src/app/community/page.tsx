"use client";

import { useState } from "react";
import ComposeBox from "./components/ComposeBox";
import PostCard, { Post } from "./components/PostCard";
import CrisisBanner from "@/app/companion/components/CrisisBanner";
import { detectRisk } from "@/lib/crisisDetection";

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    author: "Sarah Jenkins",
    avatar: "SJ",
    isVerified: true,
    time: "2 jam lalu",
    tag: "Mindfulness",
    content:
      "Baru saja menyelesaikan 7 hari streak breathing exercise di Zyba! Rasanya beban pikiran jauh lebih ringan menghadapi pekan ujian. Tetap semangat semuanya! 🌿✨ #zybarocks #mindfulness",
    likes: 34,
    commentsCount: 2,
    repostsCount: 5,
    userLiked: false,
    userReposted: false,
    comments: [
      {
        id: "c-1",
        author: "Alex Rivera",
        avatar: "AL",
        time: "1 jam lalu",
        content: "Keren banget Sarah! Konsistensi breathing 4-4-4 emang ngebantu banget.",
      },
      {
        id: "c-2",
        author: "Dimas Anggara",
        avatar: "DA",
        time: "45 mnt lalu",
        content: "Selamat streak 7 harinya! Semangat ujiannya ya.",
      },
    ],
  },
  {
    id: "post-2",
    author: "Dimas Anggara",
    avatar: "DA",
    isVerified: false,
    time: "5 jam lalu",
    tag: "SleepRoutine",
    content:
      "Dulu sering begadang sampai subuh karena overthinking. Setelah ikuti rekomendasi sleep hygiene di ZYBA, akhirnya bisa tidur teratur jam 11 malam. Small wins count! 🌙 #gratefulness #zybacare",
    likes: 58,
    commentsCount: 1,
    repostsCount: 3,
    userLiked: true,
    userReposted: false,
    comments: [
      {
        id: "c-3",
        author: "Nadia Putri",
        avatar: "NP",
        time: "3 jam lalu",
        content: "Bener banget, mematikan layar 30 menit sebelum tidur pengaruhnya besar!",
      },
    ],
  },
  {
    id: "post-3",
    author: "Rizky Pratama",
    avatar: "RP",
    isVerified: true,
    time: "Kemarin",
    tag: "Sharing",
    content:
      "Belajar untuk tidak terlalu keras pada diri sendiri hari ini. Setiap proses butuh waktu, dan istirahat bukan berarti menyerah. Hope you all have a peaceful day! ☕🌱 #selfcare #zybarocks",
    likes: 82,
    commentsCount: 0,
    repostsCount: 12,
    userLiked: false,
    userReposted: false,
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"FOR_YOU" | "FOLLOWING">("FOR_YOU");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [showCrisisNotice, setShowCrisisNotice] = useState(false);

  const currentPosts = activeTab === "FOR_YOU" ? posts : followingPosts;

  const handleToggleLike = (id: string) => {
    const updater = (prev: Post[]) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            userLiked: !p.userLiked,
            likes: p.userLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      });

    setPosts(updater);
    setFollowingPosts(updater);
  };

  const handleToggleRepost = (id: string) => {
    const updater = (prev: Post[]) =>
      prev.map((p) => {
        if (p.id === id) {
          const isReposted = !p.userReposted;
          return {
            ...p,
            userReposted: isReposted,
            repostsCount: (p.repostsCount ?? 0) + (isReposted ? 1 : -1),
          };
        }
        return p;
      });

    setPosts(updater);
    setFollowingPosts(updater);
  };

  const handleAddComment = async (postId: string, commentText: string) => {
    // Safety check detectRisk for free-text comments
    const isRisk = detectRisk(commentText);
    if (isRisk) {
      setShowCrisisNotice(true);
    }

    const newComment = {
      id: `c-${Date.now()}`,
      author: "Alex Rivera",
      avatar: "AL",
      time: "Baru saja",
      content: commentText,
    };

    const updater = (prev: Post[]) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      });

    setPosts(updater);
    setFollowingPosts(updater);
  };

  const handleAddPost = async (content: string, tag: string) => {
    // Safety check detectRisk for free-text posts
    const isRisk = detectRisk(content);
    if (isRisk) {
      setShowCrisisNotice(true);
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: "Alex Rivera",
      avatar: "AL",
      isVerified: true,
      time: "Baru saja",
      tag,
      content,
      likes: 0,
      commentsCount: 0,
      repostsCount: 0,
      userLiked: false,
      userReposted: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    if (activeTab === "FOLLOWING") {
      setFollowingPosts([newPost, ...followingPosts]);
    }

    // Call /api/community endpoint
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tag }),
      });
      const data = await res.json();
      if (data.isRisk) {
        setShowCrisisNotice(true);
      }
    } catch (err) {
      console.warn("API Community post sync:", err);
    }
  };

  return (
    <div className="flex flex-col items-center w-full pb-16">
      {/* 11.1 Kolom Feed Tengah max-w ~600px */}
      <div className="w-full max-w-[620px] flex flex-col gap-5">
        {/* Header Komunitas & Pill Toggle Tab */}
        <div className="flex flex-col items-center text-center gap-3 pt-2 pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <h1 className="font-display font-extrabold text-2xl text-brown-900">
              Zyba Community
            </h1>
          </div>
          <p className="text-xs text-brown-700 max-w-md">
            Ruang aman dan suportif sesama Gen Z untuk saling berbagi cerita, afirmasi positif, dan tips wellness harian.
          </p>

          {/* 11.1 Tab Sekunder Pill Toggle ("For You" / "Following") */}
          <div className="inline-flex p-1 bg-cream/90 rounded-pill border border-brown-900/10 shadow-xs mt-2">
            <button
              type="button"
              onClick={() => setActiveTab("FOR_YOU")}
              className={`px-6 py-2 rounded-pill text-xs font-bold transition-all ${
                activeTab === "FOR_YOU"
                  ? "bg-brown-900 text-white shadow-xs"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              Untuk Anda
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("FOLLOWING")}
              className={`px-6 py-2 rounded-pill text-xs font-bold transition-all ${
                activeTab === "FOLLOWING"
                  ? "bg-brown-900 text-white shadow-xs"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              Mengikuti
            </button>
          </div>
        </div>

        {/* Banner Pendampingan Krisis Tenang jika terdeteksi */}
        {showCrisisNotice && (
          <CrisisBanner onClose={() => setShowCrisisNotice(false)} />
        )}

        {/* 11.2 Compose Box di atas Feed */}
        <ComposeBox
          onAddPost={handleAddPost}
          onRiskDetected={() => setShowCrisisNotice(true)}
        />

        {/* 11.3 Feed Stream dengan Divider Tipis Antar Post */}
        <div className="bg-white rounded-2xl border border-brown-900/10 px-5 divide-y divide-brown-900/10 shadow-xs">
          {currentPosts.length === 0 ? (
            /* 11.4 Empty State Feed */
            <div className="py-16 px-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-cream border border-orange-500/20 flex items-center justify-center text-2xl mb-4 shadow-sm">
                🌿
              </div>
              <h3 className="font-display font-bold text-lg text-brown-900">
                Belum ada cerita di sini
              </h3>
              <p className="text-xs text-brown-700 mt-1 max-w-sm leading-relaxed">
                {activeTab === "FOLLOWING"
                  ? "Kamu belum mengikuti siapa pun. Jelajahi cerita hangat dari komunitas ZYBA sekarang."
                  : "Jadilah yang pertama berbagi cerita hangat hari ini!"}
              </p>
              {activeTab === "FOLLOWING" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("FOR_YOU")}
                  className="mt-5 rounded-pill bg-orange-500 text-white text-xs font-bold px-6 py-2.5 hover:opacity-90 transition-opacity shadow-sm"
                >
                  Jelajahi komunitas →
                </button>
              )}
            </div>
          ) : (
            currentPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={handleToggleLike}
                onToggleRepost={handleToggleRepost}
                onAddComment={handleAddComment}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
