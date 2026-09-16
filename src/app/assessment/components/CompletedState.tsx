"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CompletedState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center my-auto text-center gap-6 py-8 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 rounded-3xl bg-green-500 text-white font-display font-extrabold flex items-center justify-center text-4xl shadow-xl shadow-green-500/20">
        80
      </div>
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-green-500">
          You're All Set Up!
        </span>
        <h2 className="font-display font-extrabold text-3xl text-brown-900 mt-1">
          Skor Awal ZYBA: 80 / 100
        </h2>
        <p className="text-xs text-brown-700 mt-2 max-w-md">
          Profil kesehatan mentalmu telah berhasil dibuat. Kamu siap mengakses seluruh fitur Zyba Companion, Smart Activity Planner, dan Community!
        </p>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="px-8 py-3.5 rounded-full bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs shadow-lg transition-colors"
      >
        Buka Dashboard ZYBA →
      </button>
    </div>
  );
}
