"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleAuthProfileModal from "@/components/GoogleAuthProfileModal";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [authTab, setAuthTab] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [otpPin, setOtpPin] = useState(["", "", "", ""]);
  const [demoOtpNotice, setDemoOtpNotice] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);

  // Notification Toggles
  const [notifCompanion, setNotifCompanion] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleAuthSubmit = async (provider: "EMAIL" | "GOOGLE" = "EMAIL") => {
    if (provider === "GOOGLE") {
      setShowGoogleModal(true);
      return;
    }

    if (authTab === "SIGN_UP") {
      setIsRequestingOtp(true);
      setOtpError("");
      try {
        const targetEmail = email || "alex@zyba.app";

        const res = await fetch("/api/auth/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "REQUEST",
            email: targetEmail,
            provider,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setShowOtpModal(true);
          setDemoOtpNotice(`Kode OTP telah dikirimkan ke email (${targetEmail}). Untuk mode demo/pengujian: gunakan kode 0000.`);
          setOtpPin(["", "", "", ""]);
        } else {
          setOtpError(data.error || "Gagal meminta kode OTP.");
        }
      } catch (err) {
        console.error("Error requesting OTP:", err);
        setOtpError("Terjadi kesalahan jaringan.");
      } finally {
        setIsRequestingOtp(false);
      }
    } else {
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

        if (res.ok) {
          router.push("/dashboard");
        } else {
          const data = await res.json();
          alert(data.error || "Gagal login.");
        }
      } catch (err) {
        alert("Terjadi kesalahan jaringan.");
      }
    }
  };

  const handleOtpVerify = async () => {
    const inputOtp = otpPin.join("");
    if (inputOtp.length < 4) {
      setOtpError("Masukkan 4 digit kode OTP.");
      return;
    }

    setOtpError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_OTP",
          email: email || "alex@zyba.app",
          otp: inputOtp,
          name: name || (email ? email.split("@")[0] : "Alex"),
          password: password || "demo_password",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowOtpModal(false);
        router.push("/assessment");
      } else {
        setOtpError(data.error || "Gagal memverifikasi OTP.");
      }
    } catch (err) {
      setOtpError("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Left Carousel Column */}
      <OnboardingCarousel 
        currentSlide={currentSlide} 
        onNextSlide={handleNextSlide} 
        slides={SLIDES} 
      />

      {/* Right Auth & Setup Column */}
      <OnboardingAuth 
        authTab={authTab}
        onAuthTabChange={setAuthTab}
        handleAuthSubmit={handleAuthSubmit}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
        showOtpModal={showOtpModal}
        setShowOtpModal={setShowOtpModal}
        otpPin={otpPin}
        setOtpPin={setOtpPin}
        demoOtpNotice={demoOtpNotice}
        otpError={otpError}
        isRequestingOtp={isRequestingOtp}
        notifCompanion={notifCompanion}
        setNotifCompanion={setNotifCompanion}
        notifWellness={notifWellness}
        setNotifWellness={setNotifWellness}
        notifCommunity={notifCommunity}
        setNotifCommunity={setNotifCommunity}
        handleOtpVerify={handleOtpVerify}
        onShowForgotModalChange={setShowForgotModal}
        router={router}
      />

      {/* Modals */}
      {showOtpModal && <OtpModal 
        email={email}
        demoOtpNotice={demoOtpNotice}
        otpError={otpError}
        otpPin={otpPin}
        setOtpPin={setOtpPin}
        isRequestingOtp={isRequestingOtp}
        handleOtpVerify={handleOtpVerify}
      />}
      {showForgotModal && <ForgotPasswordModal 
        setShowForgotModal={setShowForgotModal} 
      />}
      <GoogleAuthProfileModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </div>
  );
}

// --- Extracted Components ---

const SLIDES = [
  {
    title: "Welcome to ZYBA",
    subtitle: "Pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.",
    emoji: "🌱",
    bg: "from-orange-100/50 to-cream",
  },
  {
    title: "Personalize Your Mental Health State With AI",
    subtitle: "Analisis emosi cerdas dan penyesuaian gaya komunikasi AI yang fleksibel.",
    emoji: "🤖",
    bg: "from-green-100/50 to-cream",
  },
  {
    title: "Intelligent Mood Tracking & Emotion Insights",
    subtitle: "Catat suasana hati harianmu dan dapatkan grafik rekomendasi resiliensi.",
    emoji: "📊",
    bg: "from-orange-100/50 to-cream",
  },
  {
    title: "Mindful Resources That Make You Happy",
    subtitle: "Koleksi artikel ilmu psikologi dan audio meditasi relaksasi 5 menit.",
    emoji: "🎧",
    bg: "from-green-100/50 to-cream",
  },
  {
    title: "Loving & Supportive Community",
    subtitle: "Ruang aman untuk berbagi cerita dan motivasi tanpa saling menghakimi.",
    emoji: "💬",
    bg: "from-orange-100/50 to-cream",
  },
];

function OnboardingCarousel({
  currentSlide,
  onNextSlide,
  slides,
}: {
  currentSlide: number;
  onNextSlide: () => void;
  slides: Array<{
    title: string;
    subtitle: string;
    emoji: string;
    bg: string;
  }>;
}) {
  return (
    <div className="col-span-6 glass-card rounded-3xl p-8 border border-brown-900/10 flex flex-col justify-between h-full min-h-[500px] bg-gradient-to-br from-white via-cream to-green-100/30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
          ZB
        </div>
        <span className="font-display font-extrabold text-xl text-brown-900">ZYBA</span>
      </div>

      <div className="my-auto flex flex-col items-center text-center gap-4 py-8">
        <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-5xl border border-brown-900/10">
          {slides[currentSlide].emoji}
        </div>
        <h2 className="font-display text-2xl font-extrabold text-brown-900 max-w-sm">
          {slides[currentSlide].title}
        </h2>
        <p className="text-xs text-brown-700 max-w-xs leading-relaxed">
          {slides[currentSlide].subtitle}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => onNextSlide()}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                i === currentSlide ? "w-6 bg-orange-500" : "w-2 bg-brown-900/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={onNextSlide}
          className="px-5 py-2 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-orange-500 transition-colors"
        >
          Lanjut Slide →
        </button>
      </div>
    </div>
  );
}

function OnboardingAuth({
  authTab,
  onAuthTabChange,
  handleAuthSubmit,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  selectedAvatar,
  setSelectedAvatar,
  showOtpModal,
  setShowOtpModal,
  otpPin,
  setOtpPin,
  demoOtpNotice,
  otpError,
  isRequestingOtp,
  notifCompanion,
  setNotifCompanion,
  notifWellness,
  setNotifWellness,
  notifCommunity,
  setNotifCommunity,
  handleOtpVerify,
  onShowForgotModalChange,
  router,
}: {
  authTab: "SIGN_IN" | "SIGN_UP";
  onAuthTabChange: (tab: "SIGN_IN" | "SIGN_UP") => void;
  handleAuthSubmit: (provider: "EMAIL" | "GOOGLE") => Promise<void>;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  selectedAvatar: string;
  setSelectedAvatar: (v: string) => void;
  showOtpModal: boolean;
  setShowOtpModal: (v: boolean) => void;
  otpPin: string[];
  setOtpPin: (v: string[]) => void;
  demoOtpNotice: string;
  otpError: string;
  isRequestingOtp: boolean;
  notifCompanion: boolean;
  setNotifCompanion: (v: boolean) => void;
  notifWellness: boolean;
  setNotifWellness: (v: boolean) => void;
  notifCommunity: boolean;
  setNotifCommunity: (v: boolean) => void;
  handleOtpVerify: () => Promise<void>;
  onShowForgotModalChange: (v: boolean) => void;
  router: any;
}) {
  return (
    <div className="col-span-6 glass-card rounded-3xl p-8 border border-brown-900/10 bg-white flex flex-col justify-between min-h-[500px]">
      <div>
        <div className="flex items-center gap-2 bg-cream p-1 rounded-2xl border border-brown-900/10 mb-6">
          <button
            onClick={() => onAuthTabChange("SIGN_IN")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authTab === "SIGN_IN" ? "bg-brown-900 text-white shadow-sm" : "text-brown-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => onAuthTabChange("SIGN_UP")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authTab === "SIGN_UP" ? "bg-brown-900 text-white shadow-sm" : "text-brown-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="font-display text-xl font-bold text-brown-900 mb-1">
          {authTab === "SIGN_IN" ? "Selamat Datang Kembali!" : "Buat Akun ZYBA Baru"}
        </h2>
        <p className="text-xs text-brown-700 mb-6">
          {authTab === "SIGN_IN"
            ? "Masukkan email dan kata sandimu untuk masuk."
            : "Daftar dengan Email atau Google akun untuk menerima kode verifikasi OTP ke Gmail."}
        </p>

        {/* Google Social Login Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => handleAuthSubmit("GOOGLE")}
            className="w-full py-3 rounded-2xl bg-cream border border-brown-900/10 hover:bg-green-100/50 text-xs font-bold text-brown-900 flex items-center justify-center gap-2 transition-colors"
          >
            <span className="text-base">🌐</span> Continue with Google (Gmail OTP)
          </button>
          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-brown-900/10" />
            <span className="px-3 text-[10px] text-brown-700/60 uppercase">atau email</span>
            <div className="flex-1 border-t border-brown-900/10" />
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAuthSubmit("EMAIL"); }} className="flex flex-col gap-4">
          {authTab === "SIGN_UP" && (
            <div>
              <label className="text-xs font-bold text-brown-900">Pilih Avatar & Nama:</label>
              <div className="flex items-center gap-2 my-2">
                {["🦊", "🐼", "🦁", "🐰", "🐯"].map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center border-2 ${
                      selectedAvatar === av ? "border-orange-500 bg-orange-100" : "border-brown-900/10 bg-cream"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap"
                className="w-full bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-medium focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-brown-900">Alamat Gmail / Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@gmail.com"
              required
              className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-medium focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-brown-900">Kata Sandi:</label>
              {authTab === "SIGN_IN" && (
                <button
                  type="button"
                  onClick={() => onShowForgotModalChange(true)}
                  className="text-[11px] text-orange-500 font-bold hover:underline"
                >
                  Lupa Password?
                </button>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-medium focus:outline-none"
            />
          </div>

          {authTab === "SIGN_UP" && (
            <div className="flex flex-col gap-2 p-3 bg-cream/40 rounded-2xl border border-brown-900/10 my-1">
              <span className="text-[11px] font-bold text-brown-900">Pengaturan Notifikasi:</span>
              <label className="flex items-center justify-between text-xs text-brown-700 cursor-pointer">
                <span>Notifikasi Chatbot Companion</span>
                <input
                  type="checkbox"
                  checked={notifCompanion}
                  onChange={(e) => setNotifCompanion(e.target.checked)}
                  className="accent-green-500"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-brown-700 cursor-pointer">
                <span>Pengingat Wellness & Mood Check-In</span>
                <input
                  type="checkbox"
                  checked={notifWellness}
                  onChange={(e) => setNotifWellness(e.target.checked)}
                  className="accent-green-500"
                />
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isRequestingOtp}
            className="mt-2 w-full py-3.5 rounded-full bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-40"
          >
            {isRequestingOtp
              ? "Mengirim Kode OTP ke Gmail..."
              : authTab === "SIGN_IN"
              ? "Masuk ke ZYBA →"
              : "Daftar & Kirim OTP ke Gmail →"}
          </button>
        </form>
      </div>

      <div className="pt-4 border-t border-brown-900/10 text-center">
        <span className="text-[11px] text-brown-700">
          Dengan melanjutkan, kamu menyetujui Ketentuan Layanan & Kebijakan Privasi ZYBA.
        </span>
      </div>
    </div>
  );
}

function OtpModal({
  email,
  demoOtpNotice,
  otpError,
  otpPin,
  setOtpPin,
  isRequestingOtp,
  handleOtpVerify,
}: {
  email: string;
  demoOtpNotice: string;
  otpError: string;
  otpPin: string[];
  setOtpPin: (v: string[]) => void;
  isRequestingOtp: boolean;
  handleOtpVerify: () => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-brown-900/10 text-center flex flex-col gap-5">
        <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-500 font-bold flex items-center justify-center text-2xl mx-auto">
          ✉️
        </div>
        <div>
          <h3 className="font-display font-extrabold text-lg text-brown-900">
            Verifikasi Gmail OTP 4 Digit
          </h3>
          <p className="text-xs text-brown-700 mt-1">
            Kode verifikasi OTP telah dikirimkan ke <strong>{email || "alex@gmail.com"}</strong>.
          </p>
        </div>

        {demoOtpNotice && (
          <span className="text-[10px] bg-green-100 text-green-500 font-bold p-2.5 rounded-xl border border-green-500/30">
            {demoOtpNotice}
          </span>
        )}

        {otpError && (
          <span className="text-[10px] bg-orange-100 text-danger font-bold p-2 rounded-xl">
            {otpError}
          </span>
        )}

        <div className="flex justify-center gap-3 my-2">
          {[0, 1, 2, 3].map((idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={otpPin[idx]}
              onChange={(e) => {
                const val = e.target.value;
                const next = [...otpPin];
                next[idx] = val;
                setOtpPin(next);
              }}
              className="w-12 h-12 text-center text-lg font-bold bg-cream rounded-2xl border border-brown-900/20 focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900"
            />
          ))}
        </div>

        <button
          onClick={handleOtpVerify}
          className="w-full py-3 rounded-full bg-brown-900 text-white font-bold text-xs hover:bg-green-500 transition-colors"
        >
          Verifikasi Kode & Masuk →
        </button>
      </div>
    </div>
  );
}

function ForgotPasswordModal({
  setShowForgotModal,
}: {
  setShowForgotModal: (v: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-brown-900/10 flex flex-col gap-4">
        <h3 className="font-display font-extrabold text-base text-brown-900">
          Lupa Kata Sandi?
        </h3>
        <p className="text-xs text-brown-700">
          Masukkan alamat Gmail terdaftar untuk menerima kode verifikasi pemulihan.
        </p>
        <input
          type="email"
          placeholder="alex@gmail.com"
          className="bg-cream rounded-2xl border border-brown-900/10 p-3 text-xs text-brown-900 focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setShowForgotModal(false)}
            className="flex-1 py-2.5 rounded-full border border-brown-900/10 text-xs font-bold text-brown-700"
          >
            Batal
          </button>
          <button
            onClick={() => {
              alert("Kode OTP pemulihan telah dikirim ke email!");
              setShowForgotModal(false);
            }}
            className="flex-1 py-2.5 rounded-full bg-orange-500 text-white text-xs font-bold"
          >
            Kirim OTP →
          </button>
        </div>
      </div>
    </div>
  );
}