"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex@zyba.app");
  const [phone, setPhone] = useState("+62 812-3456-7890");
  const [location, setLocation] = useState("Jakarta, Indonesia");
  const [bio, setBio] = useState("Mahasiswa & Gen Z Wellness Enthusiast.");

  const [commStyle, setCommStyle] = useState<"CASUAL" | "FORMAL" | "FUN">("CASUAL");
  const [notifChatbot, setNotifChatbot] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brown-900 text-white text-xs font-bold uppercase tracking-wider">
              Account & Settings
            </span>
            <span className="text-xs text-brown-700">Zyba Settings</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Pengaturan Akun & Presensi
          </h1>
          <p className="text-xs text-brown-700 mt-1 max-w-xl">
            Atur profil pribadi, preferensi gaya komunikasi AI Zyba Companion, serta privasi dan keamanan akunmu.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs px-6 py-3 rounded-full transition-colors shadow-md shrink-0"
        >
          {isSaved ? "✓ Tersimpan!" : "Simpan Perubahan →"}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile & Account Details */}
        <ProfileSection
          name={name}
          email={email}
          phone={phone}
          location={location}
          bio={bio}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onLocationChange={setLocation}
          onBioChange={setBio}
        />

        {/* Right Column: AI Style & Security Toggles */}
        <SettingsToggles
          commStyle={commStyle}
          onCommStyleChange={setCommStyle}
          notifChatbot={notifChatbot}
          onNotifChatbotChange={setNotifChatbot}
          notifWellness={notifWellness}
          onNotifWellnessChange={setNotifWellness}
          notifCommunity={notifCommunity}
          onNotifCommunityChange={setNotifCommunity}
          fingerprintEnabled={fingerprintEnabled}
          onFingerprintChange={setFingerprintEnabled}
        />
      </div>
    </div>
  );
}

// --- Extracted Components ---

function ProfileSection({
  name,
  email,
  phone,
  location,
  bio,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onLocationChange,
  onBioChange,
}: {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onBioChange: (v: string) => void;
}) {
  return (
    <div className="lg:col-span-7 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col gap-6 bg-white">
      <h2 className="font-display text-lg font-bold text-brown-900 border-b border-brown-900/10 pb-3">
        1. Profil Pengguna
      </h2>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-500 text-white font-display font-extrabold flex items-center justify-center text-xl shadow-md">
          AL
        </div>
        <div>
          <span className="text-sm font-bold text-brown-900 block">{name}</span>
          <span className="text-xs text-brown-700 block">{email}</span>
          <span className="text-[10px] bg-orange-100 text-orange-500 font-bold px-2 py-0.5 rounded-full inline-block mt-1">
            Zyba Plus Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-brown-900">Nama Lengkap:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-brown-900">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-brown-900">Nomor HP:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-brown-900">Lokasi / Kota:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-brown-900">Bio Singkat:</label>
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          rows={2}
          className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 p-3 text-xs text-brown-900 font-bold focus:outline-none"
        />
      </div>
    </div>
  );
}

function SettingsToggles({
  commStyle,
  onCommStyleChange,
  notifChatbot,
  onNotifChatbotChange,
  notifWellness,
  onNotifWellnessChange,
  notifCommunity,
  onNotifCommunityChange,
  fingerprintEnabled,
  onFingerprintChange,
}: {
  commStyle: "CASUAL" | "FORMAL" | "FUN";
  onCommStyleChange: (v: "CASUAL" | "FORMAL" | "FUN") => void;
  notifChatbot: boolean;
  onNotifChatbotChange: (v: boolean) => void;
  notifWellness: boolean;
  onNotifWellnessChange: (v: boolean) => void;
  notifCommunity: boolean;
  onNotifCommunityChange: (v: boolean) => void;
  fingerprintEnabled: boolean;
  onFingerprintChange: (v: boolean) => void;
}) {
  return (
    <div className="lg:col-span-5 flex flex-col gap-6">
      <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4 bg-white">
        <h3 className="font-display text-base font-bold text-brown-900 border-b border-brown-900/10 pb-2">
          2. Preferensi Zyba Companion
        </h3>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-brown-900">Gaya Bahasa AI Chatbot:</label>
          {(["CASUAL", "FORMAL", "FUN"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onCommStyleChange(s)}
              className={`p-3 rounded-2xl text-xs font-bold border transition-colors flex items-center justify-between ${
                commStyle === s
                  ? "bg-brown-900 text-white border-brown-900"
                  : "bg-cream text-brown-900 border-brown-900/10 hover:border-orange-500"
              }`}
            >
              <span>{s}</span>
              {commStyle === s && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4 bg-white">
        <h3 className="font-display text-base font-bold text-brown-900 border-b border-brown-900/10 pb-2">
          3. Keamanan & Notifikasi
        </h3>

        <div className="flex flex-col gap-3 text-xs text-brown-900">
          <label className="flex items-center justify-between cursor-pointer">
            <span>Otensifikasi Biometrik / Fingerprint</span>
            <input
              type="checkbox"
              checked={fingerprintEnabled}
              onChange={(e) => onFingerprintChange(e.target.checked)}
              className="accent-green-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>Notifikasi Chat Companion</span>
            <input
              type="checkbox"
              checked={notifChatbot}
              onChange={(e) => onNotifChatbotChange(e.target.checked)}
              className="accent-green-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>Pengingat Mood Check-In & Tidur</span>
            <input
              type="checkbox"
              checked={notifWellness}
              onChange={(e) => onNotifWellnessChange(e.target.checked)}
              className="accent-green-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>Notifikasi Aktivitas Komunitas</span>
            <input
              type="checkbox"
              checked={notifCommunity}
              onChange={(e) => onNotifCommunityChange(e.target.checked)}
              className="accent-green-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
