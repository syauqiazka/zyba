"use client";

import { useState } from "react";
import PostCard from "./components/PostCard";
import CreatePostModal from "./components/CreatePostModal";
import SidebarInfo from "./components/SidebarInfo";

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
            <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} />
          ))}
        </div>

        {/* Right Sidebar Rules & Community Guidelines */}
        <SidebarInfo />
      </div>

      {/* CREATE POST MODAL */}
      <CreatePostModal
        open={showCreateModal}
        newPostContent={newPostContent}
        selectedTag={selectedTag}
        onContentChange={setNewPostContent}
        onTagChange={setSelectedTag}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
