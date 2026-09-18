"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import OnboardingPage from "@/app/onboarding/page";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      {/* Tombol Kembali */}
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-5 left-6 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream border border-brown-900/15 text-brown-700 text-xs font-bold hover:bg-white hover:text-brown-900 transition-colors shadow-sm"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali
      </button>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-brown-700">Memuat...</div>}>
        <OnboardingPage />
      </Suspense>
    </div>
  );
}
