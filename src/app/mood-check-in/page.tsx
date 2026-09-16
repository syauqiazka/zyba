"use client";

import { useState } from "react";
import { detectRisk } from "@/lib/crisisDetection";
import MoodBanner from "./components/MoodBanner";
import MoodSelectorForm from "./components/MoodSelectorForm";
import CalendarWidget from "./components/CalendarWidget";
import JournalHistory from "./components/JournalHistory";
import CrisisAlertModal from "./components/CrisisAlertModal";

const MOODS = [
  { value: "DEPRESSED", label: "Depressed", emoji: "😞", bg: "#A99BE0", text: "text-white" },
  { value: "SAD", label: "Sad", emoji: "🙁", bg: "#EE8A5E", text: "text-white" },
  { value: "NEUTRAL", label: "Neutral", emoji: "😐", bg: "#6B5645", text: "text-white" },
  { value: "HAPPY", label: "Happy", emoji: "🙂", bg: "#E8C24A", text: "text-brown-900" },
  { value: "OVERJOYED", label: "Overjoyed", emoji: "😄", bg: "#8FAE5D", text: "text-white" },
] as const;

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  flaggedForRisk?: boolean;
}

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: "j-1",
    title: "Selesai Presentasi Proyek",
    content: "Hari ini presentasi berjalan lancar meskipun sempat deg-degan. Tim memberikan feedback positif!",
    mood: "HAPPY",
    date: "15 Sep 2026",
  },
  {
    id: "j-2",
    title: "Istirahat Sejenak dari Layar",
    content: "Jalan santai di taman kampus selama 20 menit membantu menjernihkan pikiran.",
    mood: "OVERJOYED",
    date: "14 Sep 2026",
  },
];

export default function MoodCheckInPage() {
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[number]>(MOODS[3]); // Happy default
  const [stressRating, setStressRating] = useState<number>(2);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalList, setJournalList] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);

  const handleSaveCheckIn = () => {
    if (!journalTitle.trim() && !journalContent.trim()) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      return;
    }

    const isRisk = detectRisk(journalContent);
    if (isRisk) {
      setCrisisAlert(true);
    }

    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      title: journalTitle || "Entri Mood Harian",
      content: journalContent,
      mood: selectedMood.value,
      date: "Hari Ini",
      flaggedForRisk: isRisk,
    };

    setJournalList([newEntry, ...journalList]);
    setJournalTitle("");
    setJournalContent("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <MoodBanner selectedMood={selectedMood} />

      {/* Main Grid: Mood Selector & Stress Rating Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Mood & Stress Input */}
        <MoodSelectorForm
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          stressRating={stressRating}
          setStressRating={setStressRating}
          journalTitle={journalTitle}
          setJournalTitle={setJournalTitle}
          journalContent={journalContent}
          setJournalContent={setJournalContent}
          savedSuccess={savedSuccess}
          onSave={handleSaveCheckIn}
        />

        {/* Right Panel: Calendar & Journal History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <CalendarWidget />
          <JournalHistory journalList={journalList} />
        </div>
      </div>

      <CrisisAlertModal isOpen={crisisAlert} onClose={() => setCrisisAlert(false)} />
    </div>
  );
}
