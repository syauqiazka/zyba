"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DesktopShowcase from "./components/DesktopShowcase";
import SignInCard from "./components/SignInCard";
import ForgotPasswordCard from "./components/ForgotPasswordCard";
import ProfileSecurityFlow from "./components/ProfileSecurityFlow";
import GoogleAuthProfileModal from "@/components/GoogleAuthProfileModal";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "SIGN_IN" (Frame 1) | "FORGOT_PASSWORD" (Frame 2) | "SIGN_UP" (Profile Security Setup - Bottom Row)
  const initialTab = searchParams.get("tab") === "signup" ? "SIGN_UP" : "SIGN_IN";
  const [authMode, setAuthMode] = useState<"SIGN_IN" | "FORGOT_PASSWORD" | "SIGN_UP">(initialTab);

  // Form Fields for Sign In
  const [email, setEmail] = useState("alex@zyba.app");
  const [password, setPassword] = useState("demo_password");
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "signup") {
      setAuthMode("SIGN_UP");
    } else if (tabParam === "signin" || tabParam === "login") {
      setAuthMode("SIGN_IN");
    }
  }, [searchParams]);

  // Sign In Handler
  const handleSignIn = async () => {
    setIsLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "LOGIN",
          email: email || "alex@zyba.app",
          password: password || "demo_password",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setLoginError(data.error || "Email atau password salah.");
        alert(data.error || "Gagal masuk. Periksa kembali email dan password.");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setLoginError("Terjadi kesalahan jaringan.");
      alert("Terjadi kesalahan koneksi server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      {/* Split-Screen Desktop Container (max-w 1200px sesuai AGENTS.md Bagian 5) */}
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Kolom Kiri: Desktop Showcase Experience (7 Kolom di Desktop) */}
        <div className="lg:col-span-6 xl:col-span-7 flex">
          <DesktopShowcase />
        </div>

        {/* Kolom Kanan: Card Interaktif sesuai Figma Screens (5 Kolom di Desktop) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center">
          {/* Top Quick Tab Selector untuk Pengalaman Desktop yang Luwes */}
          <div className="w-full max-w-md flex items-center justify-between bg-cream/70 p-1 rounded-full border border-brown-900/10 mb-4 shadow-xs">
            <button
              type="button"
              onClick={() => setAuthMode("SIGN_IN")}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                authMode === "SIGN_IN"
                  ? "bg-brown-900 text-white shadow-sm"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              Sign In (Masuk)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("SIGN_UP")}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                authMode === "SIGN_UP"
                  ? "bg-brown-900 text-white shadow-sm"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              Sign Up (Setup Profil)
            </button>
          </div>

          {/* Mode 1: Sign In To Zyba (Frame 1 Figma) */}
          {authMode === "SIGN_IN" && (
            <SignInCard
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onSubmit={handleSignIn}
              onGoogleClick={() => setShowGoogleModal(true)}
              onForgotPasswordClick={() => setAuthMode("FORGOT_PASSWORD")}
              onSignUpClick={() => setAuthMode("SIGN_UP")}
              isLoading={isLoading}
            />
          )}

          {/* Mode 2: Forgot Password (Frame 2 Figma) */}
          {authMode === "FORGOT_PASSWORD" && (
            <ForgotPasswordCard
              onBack={() => setAuthMode("SIGN_IN")}
              defaultEmail={email}
            />
          )}

          {/* Mode 3: Profile Security Setup Flow (8 Layar Baris Bawah Figma) */}
          {authMode === "SIGN_UP" && (
            <ProfileSecurityFlow
              initialEmail={email}
              onSwitchToSignIn={() => setAuthMode("SIGN_IN")}
            />
          )}

          {/* Error notice if any */}
          {loginError && authMode === "SIGN_IN" && (
            <div className="mt-3 p-3 rounded-2xl bg-orange-100 text-danger text-xs font-bold border border-orange-500/20 max-w-md w-full text-center animate-shake">
              ⚠️ {loginError}
            </div>
          )}
        </div>
      </div>

      {/* Google Auth & Setup Profile Modal integration */}
      <GoogleAuthProfileModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-xs text-brown-700">
          Memuat ZYBA Onboarding...
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}