"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProfileSecurityFlowProps {
  initialEmail?: string;
  onSwitchToSignIn: () => void;
}

const AVATAR_OPTIONS = [
  { emoji: "🦊", label: "Rubah Cerdas", bg: "bg-orange-100" },
  { emoji: "🐼", label: "Panda Tenang", bg: "bg-green-100" },
  { emoji: "🦁", label: "Singa Berani", bg: "bg-amber-100" },
  { emoji: "🐰", label: "Kelinci Ceria", bg: "bg-pink-100" },
  { emoji: "🌿", label: "Daun Zen", bg: "bg-emerald-100" },
  { emoji: "🌸", label: "Bunga Damai", bg: "bg-rose-100" },
];

export default function ProfileSecurityFlow({
  initialEmail = "",
  onSwitchToSignIn,
}: ProfileSecurityFlowProps) {
  const router = useRouter();

  // Sub-steps 1 to 8 matching Figma bottom row
  const [step, setStep] = useState<
    | "SELECT_AVATAR"
    | "PROFILE_SETUP"
    | "PASSWORD_STRENGTH"
    | "OTP_VERIFY"
    | "FINGERPRINT"
    | "NOTIFICATIONS"
    | "COMPILING"
    | "ALL_SET_UP"
  >("SELECT_AVATAR");

  // Form State
  const [avatar, setAvatar] = useState("🦊");
  const [fullName, setFullName] = useState("Shimarron King");
  const [email, setEmail] = useState(initialEmail || "elementary21@gmail.com");
  const [password, setPassword] = useState("zybaSecure!2024");
  const [gender, setGender] = useState("Pria");
  const [location, setLocation] = useState("Jakarta, Indonesia");

  // OTP State (4 digit)
  const [otp, setOtp] = useState(["9", "5", "0", "0"]);
  const [otpError, setOtpError] = useState("");

  // Biometric state
  const [isFingerprintScanned, setIsFingerprintScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Notification Toggles
  const [notifChatbot, setNotifChatbot] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);

  // Compiling progress
  const [compileProgress, setCompileProgress] = useState(15);

  // Password strength logic
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strengthScore = (hasMinLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);

  // Compiling Data auto-advance
  useEffect(() => {
    if (step === "COMPILING") {
      const interval = setInterval(() => {
        setCompileProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("ALL_SET_UP"), 400);
            return 100;
          }
          return prev + 25;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleScanFingerprint = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsFingerprintScanned(true);
    }, 1200);
  };

  const handleFinishAndRedirect = async () => {
    try {
      // Save or update user session
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SIGNUP",
          email,
          name: fullName,
          password,
        }),
      });
    } catch {
      // Ignore network issue in demo
    }
    window.location.href = "/dashboard";
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-brown-900/10 overflow-hidden flex flex-col transition-all duration-300">
      {/* ========================================================================= */}
      {/* 1. SELECT YOUR AVATAR */}
      {/* ========================================================================= */}
      {step === "SELECT_AVATAR" && (
        <div className="flex flex-col">
          {/* Header Kubah Organik Hijau */}
          <div className="relative w-full bg-[#E2EBD2] pt-8 pb-10 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
              title="Kembali ke Sign In"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 1 of 6 • Profile Setup
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Select Your Avatar
            </h2>
          </div>

          <div className="p-8 flex flex-col items-center gap-6 bg-white -mt-4 rounded-t-3xl z-10 text-center">
            {/* Avatar Preview Besar dengan Ring Ornamen khas Figma */}
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#E2EBD2] to-orange-100 border-4 border-white shadow-xl flex items-center justify-center text-5xl">
              <span>{avatar}</span>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                ✨
              </div>
            </div>

            <div>
              <p className="text-xs text-brown-700/80 leading-relaxed max-w-xs">
                We have a set of customizable avatar. Or choose one of our friendly companions below.
              </p>
            </div>

            {/* Grid Preset Avatar */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => setAvatar(item.emoji)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1 border-2 transition-all ${
                    avatar === item.emoji
                      ? "border-orange-500 bg-orange-100/50 shadow-sm scale-105"
                      : "border-brown-900/10 bg-cream/40 hover:bg-cream"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-brown-900 truncate w-full text-center">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              onClick={() => setStep("PROFILE_SETUP")}
              className="w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PROFILE SETUP */}
      {/* ========================================================================= */}
      {step === "PROFILE_SETUP" && (
        <div className="flex flex-col">
          {/* Header Kubah dengan Avatar Lingkaran di tengah persis Figma Frame Profile Setup */}
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-12 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("SELECT_AVATAR")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 2 of 6 • Identity
            </span>

            {/* Avatar bulat di tengah lengkungan */}
            <div className="mt-3 w-16 h-16 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center text-3xl">
              {avatar}
            </div>
          </div>

          <div className="p-8 flex flex-col gap-4 bg-white -mt-6 rounded-t-3xl z-10">
            <div className="text-center">
              <h2 className="font-display font-extrabold text-xl text-brown-900">
                Profile Setup
              </h2>
              <p className="text-xs text-brown-700/80">Lengkapi data akun ZYBA Anda</p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-brown-900 pl-1 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Shimarron King"
                  className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brown-900 pl-1 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elementary21@gmail.com"
                  className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brown-900 pl-1 block mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium cursor-pointer"
                  >
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-brown-900 pl-1 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Jakarta, ID"
                    className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              onClick={() => setStep("PASSWORD_STRENGTH")}
              className="mt-2 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PASSWORD SETUP & STRENGTH METER */}
      {/* ========================================================================= */}
      {step === "PASSWORD_STRENGTH" && (
        <div className="flex flex-col">
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("PROFILE_SETUP")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 3 of 6 • Security
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Password Setup
            </h2>
          </div>

          <div className="p-8 flex flex-col gap-5 bg-white -mt-4 rounded-t-3xl z-10">
            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brown-900 pl-1">
                Ketik Kata Sandi Baru
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-3 text-xs md:text-sm text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-wider font-semibold"
              />
            </div>

            {/* Password Strength Meter Card (Figma pattern) */}
            <div className="p-4 rounded-2xl bg-cream/40 border border-brown-900/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brown-900">
                  Password Strength
                </span>
                <span
                  className={`text-[11px] font-extrabold ${
                    strengthScore === 3
                      ? "text-green-500"
                      : strengthScore === 2
                      ? "text-orange-500"
                      : "text-danger"
                  }`}
                >
                  {strengthScore === 3
                    ? "Kuat ✨"
                    : strengthScore === 2
                    ? "Sedang ⚡"
                    : "Lemah (Tingkatkan!) 💪"}
                </span>
              </div>

              {/* 3-Bar Segments */}
              <div className="grid grid-cols-3 gap-1.5">
                <div
                  className={`h-2 rounded-full transition-all ${
                    strengthScore >= 1 ? (strengthScore === 1 ? "bg-danger" : "bg-orange-500") : "bg-brown-900/15"
                  }`}
                />
                <div
                  className={`h-2 rounded-full transition-all ${
                    strengthScore >= 2 ? (strengthScore === 2 ? "bg-orange-500" : "bg-green-500") : "bg-brown-900/15"
                  }`}
                />
                <div
                  className={`h-2 rounded-full transition-all ${
                    strengthScore >= 3 ? "bg-green-500" : "bg-brown-900/15"
                  }`}
                />
              </div>

              {/* Requirement Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    hasMinLength ? "bg-green-100 text-green-500" : "bg-cream text-brown-700/60"
                  }`}
                >
                  {hasMinLength ? "✓" : "○"} Minimal 8 Karakter
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    hasNumber ? "bg-green-100 text-green-500" : "bg-cream text-brown-700/60"
                  }`}
                >
                  {hasNumber ? "✓" : "○"} Ada Angka (0-9)
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    hasSpecial ? "bg-green-100 text-green-500" : "bg-cream text-brown-700/60"
                  }`}
                >
                  {hasSpecial ? "✓" : "○"} Karakter Khusus (!@#)
                </span>
              </div>
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              onClick={() => setStep("OTP_VERIFY")}
              className="mt-2 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. OTP SETUP & 4-DIGIT VERIFICATION */}
      {/* ========================================================================= */}
      {step === "OTP_VERIFY" && (
        <div className="flex flex-col">
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("PASSWORD_STRENGTH")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 4 of 6 • Verification
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Enter 4 Digit OTP Code
            </h2>
          </div>

          <div className="p-8 flex flex-col items-center gap-6 bg-white -mt-4 rounded-t-3xl z-10 text-center">
            {/* Ilustrasi Tameng Hijau dengan Centang khas Figma */}
            <div className="w-16 h-16 rounded-3xl bg-green-100 border border-green-500/30 flex items-center justify-center text-3xl shadow-sm">
              🛡️
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-brown-900">
                OTP Verification
              </h3>
              <p className="text-xs text-brown-700/80 mt-1 max-w-xs leading-relaxed">
                Scan your biometric/email message to make your account more secure. Dikirim ke{" "}
                <strong className="text-brown-900">{email}</strong>
              </p>
            </div>

            {/* 4 Kotak Digit Besar (Contoh Figma: 9 5 0 0) */}
            <div className="flex items-center justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`otp-digit-${index}`}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-13 h-14 w-12 text-center text-2xl font-display font-extrabold rounded-2xl border-2 border-brown-900/15 bg-cream/30 text-brown-900 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-xs"
                />
              ))}
            </div>

            {otpError && (
              <span className="text-xs font-bold text-danger bg-orange-100 px-3 py-1 rounded-full">
                {otpError}
              </span>
            )}

            <div className="text-xs text-brown-700">
              Didn&apos;t receive the OTP?{" "}
              <button
                type="button"
                onClick={() => {
                  setOtp(["0", "0", "0", "0"]);
                  alert("Kode OTP demo (0000) telah diisi.");
                }}
                className="text-orange-500 font-bold hover:underline"
              >
                Resend.
              </button>
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              onClick={() => {
                if (otp.join("").length < 4) {
                  setOtpError("Masukkan 4 digit kode OTP.");
                  return;
                }
                setStep("FINGERPRINT");
              }}
              className="w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FINGERPRINT SETUP */}
      {/* ========================================================================= */}
      {step === "FINGERPRINT" && (
        <div className="flex flex-col">
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("OTP_VERIFY")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 5 of 6 • Biometrics
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Fingerprint Setup
            </h2>
          </div>

          <div className="p-8 flex flex-col items-center gap-6 bg-white -mt-4 rounded-t-3xl z-10 text-center">
            {/* Ikon Sidik Jari Biometrik Besar khas Figma */}
            <button
              type="button"
              onClick={handleScanFingerprint}
              className={`relative w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all group ${
                isFingerprintScanned
                  ? "border-green-500 bg-green-100/50 shadow-lg scale-105"
                  : isScanning
                  ? "border-orange-500 bg-orange-100/30 animate-pulse"
                  : "border-brown-900/15 bg-cream/40 hover:border-orange-500 hover:scale-102"
              }`}
            >
              {/* SVG Sidik Jari Khas Figma */}
              <svg
                className={`w-16 h-16 transition-colors ${
                  isFingerprintScanned
                    ? "text-green-500"
                    : isScanning
                    ? "text-orange-500"
                    : "text-brown-900/70 group-hover:text-brown-900"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m0 0c0 1.637.295 3.208.834 4.665M12 3a9 9 0 019 9c0 1.621-.32 3.167-.9 4.582"
                />
              </svg>

              {isScanning && (
                <div className="absolute inset-x-2 h-1 bg-orange-500 rounded-full animate-bounce" />
              )}
            </button>

            <div>
              <h3 className="font-display font-bold text-sm text-brown-900">
                {isFingerprintScanned
                  ? "Sidik Jari Berhasil Didaftarkan! ✨"
                  : isScanning
                  ? "Memindai Sensor Biometrik..."
                  : "Ketuk untuk Memindai Sidik Jari"}
              </h3>
              <p className="text-xs text-brown-700/80 mt-1 max-w-xs leading-relaxed">
                Scan your biometric fingerprint to make your account more secure and enable instant login.
              </p>
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              onClick={() => setStep("NOTIFICATIONS")}
              className="w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98"
            >
              <span>{isFingerprintScanned ? "Continue" : "Lewati / Continue"}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. NOTIFICATION SETUP */}
      {/* ========================================================================= */}
      {step === "NOTIFICATIONS" && (
        <div className="flex flex-col">
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("FINGERPRINT")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 6 of 6 • Preferences
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Notification Setup
            </h2>
          </div>

          <div className="p-8 flex flex-col gap-5 bg-white -mt-4 rounded-t-3xl z-10">
            {/* Ilustrasi Yoga/Relaksasi khas Figma */}
            <div className="w-full py-3 flex items-center justify-center bg-cream/40 rounded-2xl border border-brown-900/10">
              <span className="text-4xl">🧘‍♂️</span>
            </div>

            {/* 3 Toggle Switch (Chatbot, Wellness, Community) */}
            <div className="flex flex-col gap-3">
              {/* Chatbot Notification */}
              <div className="p-3.5 rounded-2xl bg-cream/30 border border-brown-900/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-sm">
                    💬
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brown-900">
                      Chatbot Notification
                    </span>
                    <span className="text-[10px] text-brown-700">
                      Pengingat sesi curhat Zyba Companion
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifChatbot}
                  onChange={(e) => setNotifChatbot(e.target.checked)}
                  className="w-4 h-4 accent-green-500 cursor-pointer"
                />
              </div>

              {/* Wellness Notification */}
              <div className="p-3.5 rounded-2xl bg-cream/30 border border-brown-900/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-100 text-green-500 flex items-center justify-center text-sm">
                    🌿
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brown-900">
                      Wellness Notification
                    </span>
                    <span className="text-[10px] text-brown-700">
                      Mood check-in harian & breathing tracker
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifWellness}
                  onChange={(e) => setNotifWellness(e.target.checked)}
                  className="w-4 h-4 accent-green-500 cursor-pointer"
                />
              </div>

              {/* Community Notification */}
              <div className="p-3.5 rounded-2xl bg-cream/30 border border-brown-900/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm">
                    👥
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brown-900">
                      Community Notification
                    </span>
                    <span className="text-[10px] text-brown-700">
                      Update cerita hangat dari teman ZYBA
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifCommunity}
                  onChange={(e) => setNotifCommunity(e.target.checked)}
                  className="w-4 h-4 accent-green-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              onClick={() => setStep("COMPILING")}
              className="mt-2 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. COMPILING DATA... (Orange Screen khas Figma) */}
      {/* ========================================================================= */}
      {step === "COMPILING" && (
        <div className="w-full min-h-[460px] bg-gradient-to-br from-orange-500 to-[#F2884B] p-8 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
          {/* Ornamen Lingkaran Halus */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-black/10 blur-xl pointer-events-none" />

          {/* 4-Petal Floral Logomark berputar lembut */}
          <div className="relative w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mb-6 shadow-xl animate-pulse">
            <div className="w-6 h-6 rounded-full bg-white/90" />
            <div className="absolute w-4 h-4 rounded-full bg-cream -top-1 left-1/2 -translate-x-1/2" />
            <div className="absolute w-4 h-4 rounded-full bg-green-100 -bottom-1 left-1/2 -translate-x-1/2" />
            <div className="absolute w-4 h-4 rounded-full bg-cream -left-1 top-1/2 -translate-y-1/2" />
            <div className="absolute w-4 h-4 rounded-full bg-green-100 -right-1 top-1/2 -translate-y-1/2" />
          </div>

          <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-2">
            Compiling Data...
          </h2>
          <p className="text-xs text-white/90 max-w-xs leading-relaxed mb-6 font-medium">
            Please wait... We&apos;re calculating the data based on your assessment inputs.
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-xs bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/20">
            <div
              className="bg-white h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${compileProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-white/80 mt-2">
            {compileProgress}% Selesai
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. YOU'RE ALL SET UP. (Skor 80 Hijau khas Figma) */}
      {/* ========================================================================= */}
      {step === "ALL_SET_UP" && (
        <div className="flex flex-col bg-[#EAF2DD] min-h-[460px] p-8 items-center justify-between text-center relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-500 bg-white/70 px-3 py-1 rounded-full border border-green-500/20 mb-2">
              Assessment Completed
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brown-900">
              You&apos;re all Set Up.
            </h2>
            <span className="text-xs text-brown-700/80 mt-0.5">
              Your health score is
            </span>
          </div>

          {/* Progress Ring Lingkaran Besar Skor "80" persis Figma */}
          <div className="relative my-4">
            <div className="w-36 h-36 rounded-full bg-white shadow-xl border-8 border-[#D8E8C2] flex flex-col items-center justify-center">
              <span className="font-display font-black text-5xl text-green-500 tracking-tighter">
                80
              </span>
              <span className="text-[10px] font-bold text-brown-700 uppercase tracking-wider">
                Zyba Score
              </span>
            </div>
            <div className="absolute -bottom-2 inset-x-0 flex justify-center">
              <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-brown-900 text-white shadow-xs">
                MOOD: NEUTRAL
              </span>
            </div>
          </div>

          {/* Pesan Akhir */}
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-xs text-brown-700 leading-relaxed max-w-xs">
              You&apos;re mentally stable. We&apos;re redirecting you back to the home screen. Are you ready?
            </p>

            {/* Tombol "Let's Be Mindful →" */}
            <button
              type="button"
              onClick={handleFinishAndRedirect}
              className="w-full py-4 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-lg active:scale-98"
            >
              <span>Let&apos;s Be Mindful</span>
              <span className="text-base">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
