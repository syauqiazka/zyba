"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import OnboardingPage from "@/app/onboarding/page";

function SidebarSkeleton() {
  return (
    <aside className="w-64 shrink-0 border-r border-brown-900/10 bg-white/70 backdrop-blur-md min-h-screen p-6 flex flex-col justify-between sticky top-0 h-screen z-30">
      <div className="flex flex-col gap-7">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-2xl bg-cream border border-brown-900/10 animate-pulse" />
          <div className="flex flex-col gap-1">
            <div className="w-16 h-4 bg-cream rounded animate-pulse" />
            <div className="w-20 h-2 bg-cream rounded animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 bg-cream rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </aside>
  );
}

function PageLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-in fade-in duration-300">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute w-7 h-7 rounded-full bg-orange-500/30 -top-1 left-1/2 -translate-x-1/2 animate-ping" />
        <div className="absolute w-7 h-7 rounded-full bg-green-500/30 -bottom-1 left-1/2 -translate-x-1/2 animate-ping delay-150" />
        <div className="absolute w-7 h-7 rounded-full bg-orange-500/30 -left-1 top-1/2 -translate-y-1/2 animate-ping delay-300" />
        <div className="absolute w-7 h-7 rounded-full bg-green-500/30 -right-1 top-1/2 -translate-y-1/2 animate-ping delay-500" />
        <div className="relative w-12 h-12 rounded-2xl bg-cream border border-orange-500/20 shadow-md flex items-center justify-center z-10 animate-bounce">
          <div className="absolute w-4 h-4 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2" />
          <div className="absolute w-4 h-4 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2" />
          <div className="absolute w-4 h-4 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2" />
          <div className="absolute w-4 h-4 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2" />
          <div className="w-3 h-3 rounded-full bg-brown-900 z-20" />
        </div>
      </div>
      <p className="text-xs font-semibold text-brown-700">Memuat halaman...</p>
    </div>
  );
}

const PROTECTED_PATHS = [
  "/dashboard",
  "/wellness-journey",
  "/mood-check-in",
  "/activity",
  "/companion",
  "/community",
  "/resources",
  "/assessment",
  "/settings",
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="));
    setIsAuth(!!token);
    setIsLoading(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">Loading...</div>
    );
  }

  if (isProtected && !isAuth) {
    return <OnboardingPage />;
  }

  if (pathname === "/") {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        {children}
      </Suspense>
    );
  }

  return (
    <div className="flex">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 max-w-[1280px] mx-auto px-10 py-8 min-w-0">
        <Suspense fallback={<PageLoadingFallback />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}