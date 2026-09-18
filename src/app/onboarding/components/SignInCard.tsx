"use client";

import React, { useState } from "react";

interface SignInCardProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: () => Promise<void>;
  onGoogleClick: () => void;
  onForgotPasswordClick: () => void;
  onSignUpClick: () => void;
  isLoading?: boolean;
}

export default function SignInCard({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onGoogleClick,
  onForgotPasswordClick,
  onSignUpClick,
  isLoading = false,
}: SignInCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-brown-900/10 overflow-hidden flex flex-col transition-all duration-300">
      {/* 1. Header Kubah Lengkungan Pastel Hijau Organik khas Figma */}
      <div className="relative w-full bg-[#E2EBD2] pt-8 pb-10 flex flex-col items-center justify-center overflow-hidden">
        {/* Ornamen lengkungan halus di latar */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#D4E2BF]/50 pointer-events-none" />
        <div className="absolute -bottom-8 -left-6 w-20 h-20 rounded-full bg-[#D4E2BF]/40 pointer-events-none" />

        {/* 4-petal Floral Logomark ZYBA di tengah */}
        <div className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-white/90 shadow-sm border border-orange-500/20 mb-2">
          {/* Kelopak atas (Orange) */}
          <div className="absolute w-4 h-4 rounded-full bg-orange-500 -top-1 left-1/2 -translate-x-1/2 opacity-95 shadow-xs" />
          {/* Kelopak bawah (Green) */}
          <div className="absolute w-4 h-4 rounded-full bg-green-500 -bottom-1 left-1/2 -translate-x-1/2 opacity-95 shadow-xs" />
          {/* Kelopak kiri (Orange) */}
          <div className="absolute w-4 h-4 rounded-full bg-orange-500 -left-1 top-1/2 -translate-y-1/2 opacity-95 shadow-xs" />
          {/* Kelopak kanan (Green) */}
          <div className="absolute w-4 h-4 rounded-full bg-green-500 -right-1 top-1/2 -translate-y-1/2 opacity-95 shadow-xs" />
          {/* Pusat bunga */}
          <div className="w-3 h-3 rounded-full bg-brown-900 z-10" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-widest text-brown-700/70">
          zyba.app
        </span>
      </div>

      {/* 2. Body Form Sign In */}
      <div className="p-8 flex flex-col gap-6 bg-white -mt-4 rounded-t-3xl z-10">
        <div className="text-center flex flex-col items-center">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brown-900 tracking-tight">
            Sign In To Zyba
          </h2>
          <p className="text-xs text-brown-700/80 mt-1">
            Masuk untuk melanjutkan perjalanan kesehatan mentalmu
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Input Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-brown-900 pl-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-brown-700/60 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full bg-cream/40 border border-brown-900/15 rounded-full pl-11 pr-4 py-3 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-brown-900 pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-brown-700/60 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="w-full bg-cream/40 border border-brown-900/15 rounded-full pl-11 pr-11 py-3 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-brown-700/50 hover:text-brown-900 transition-colors"
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Tombol Sign In → (Pill Button khas Figma: bg brown-900, hover orange-500) */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <span className="text-base">→</span>
              </>
            )}
          </button>
        </form>

        {/* 3. Social Login Row (f, G, 📷) */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <span className="text-[11px] font-semibold text-brown-700/60">
            atau lanjutkan dengan
          </span>
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <button
              type="button"
              onClick={() => alert("Fitur Facebook login segera hadir. Silakan gunakan Google atau Email.")}
              className="w-10 h-10 rounded-full border border-brown-900/15 bg-white hover:bg-cream text-brown-900 font-bold text-sm flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              title="Facebook"
            >
              f
            </button>

            {/* Google (G) */}
            <button
              type="button"
              onClick={onGoogleClick}
              className="w-10 h-10 rounded-full border border-orange-500/30 bg-orange-100/40 hover:bg-orange-100 text-orange-500 font-bold text-base flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              title="Google Account"
            >
              G
            </button>

            {/* Instagram / Social */}
            <button
              type="button"
              onClick={() => alert("Fitur Instagram login segera hadir. Silakan gunakan Google atau Email.")}
              className="w-10 h-10 rounded-full border border-brown-900/15 bg-white hover:bg-cream text-brown-900 text-sm flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              title="Instagram"
            >
              📸
            </button>
          </div>
        </div>

        {/* 4. Footer Links */}
        <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-brown-900/10 text-center">
          <p className="text-xs text-brown-700">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSignUpClick}
              className="text-orange-500 font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-xs font-semibold text-brown-700/70 hover:text-brown-900 transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
