"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { detectRisk } from "@/lib/crisisDetection";
import AssessmentNav from "./components/AssessmentNav";
import QuestionStep from "./components/QuestionStep";
import CompilingState from "./components/CompilingState";
import CompletedState from "./components/CompletedState";
import CrisisModal from "./components/CrisisModal";

const STEPS = [
  { title: "Goal Kesehatan", desc: "Tujuan utama pengunaan ZYBA" },
  { title: "Profil Fisik", desc: "Gender, usia, & berat badan" },
  { title: "Mood Saat Ini", desc: "Skala ekspresi emosional" },
  { title: "Riwayat Konsultasi", desc: "Bantuan profesional medis" },
  { title: "Gejala Fisik", desc: "Indikasi fisik terkait stres" },
  { title: "Kualitas Tidur", desc: "Rating 1 - 5" },
  { title: "Level Stres", desc: "Rating 1 - 5" },
  { title: "Obat & Suplemen", desc: "Konsumsi medis saat ini" },
  { title: "Gejala Mental", desc: "Keluhan kecemasan/fokus" },
  { title: "Expression Analysis", desc: "Skrining ekspresi & teks" },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [goal, setGoal] = useState("Stress Relief & Relaxation");
  const [gender, setGender] = useState("Pria");
  const [age, setAge] = useState(21);
  const [weight, setWeight] = useState(65);
  const [mood, setMood] = useState("NEUTRAL");
  const [soughtHelp, setSoughtHelp] = useState<boolean | null>(false);
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>(["Pusing ringan", "Sulit tidur"]);
  const [sleepRating, setSleepRating] = useState(3);
  const [stressRating, setStressRating] = useState(2);
  const [medications, setMedications] = useState("Tidak ada");
  const [mentalSymptoms, setMentalSymptoms] = useState<string[]>(["Mudah lelah", "Kadang overthinking"]);

  // Neutralized Expression Analysis Text (Replacing sensitive suicide placeholder)
  const [expressionText, setExpressionText] = useState(
    "Akhir-akhir ini saya merasa sedikit lelah karena beban tugas kuliah menumpuk dan jam tidur berkurang. Saya ingin melatih pikiran agar lebih tenang dan bisa mengelola waktu belajar dengan baik."
  );

  const [isCompiling, setIsCompiling] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);

  const handleNext = () => {
    if (currentStep === 9) {
      // Check crisis keywords on Expression Analysis Text
      const isRisk = detectRisk(expressionText);
      if (isRisk) {
        setCrisisAlert(true);
        return;
      }

      // Trigger Compiling Data Loading State
      setIsCompiling(true);
      setTimeout(() => {
        setIsCompiling(false);
        setIsCompleted(true);
      }, 2000);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const toggleSymptom = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brown-900">
            Mental Health Assessment
          </h1>
          <p className="text-xs text-brown-700">
            Kuisioner awal untuk menyusun rencana kesehatan mental terpersonalisasi.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-500">
          Langkah {currentStep + 1} dari 10
        </span>
      </div>

      {/* Main Multi-Step Desktop Layout */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Panel: Progress Stepper */}
        <AssessmentNav currentStep={currentStep} setCurrentStep={setCurrentStep} steps={STEPS} />

        {/* Right Panel: Active Question Card */}
        <div className="col-span-8 glass-card rounded-3xl p-8 border border-brown-900/10 flex flex-col justify-between min-h-[500px] bg-white">
          {!isCompiling && !isCompleted && (
            <QuestionStep
              currentStep={currentStep}
              goal={goal}
              setGoal={setGoal}
              gender={gender}
              setGender={setGender}
              age={age}
              setAge={setAge}
              weight={weight}
              setWeight={setWeight}
              mood={mood}
              setMood={setMood}
              soughtHelp={soughtHelp}
              setSoughtHelp={setSoughtHelp}
              physicalSymptoms={physicalSymptoms}
              setPhysicalSymptoms={setPhysicalSymptoms}
              sleepRating={sleepRating}
              setSleepRating={setSleepRating}
              stressRating={stressRating}
              setStressRating={setStressRating}
              medications={medications}
              setMedications={setMedications}
              mentalSymptoms={mentalSymptoms}
              setMentalSymptoms={setMentalSymptoms}
              expressionText={expressionText}
              setExpressionText={setExpressionText}
              toggleSymptom={toggleSymptom}
              handleNext={handleNext}
              handlePrev={handlePrev}
            />
          )}

          {/* COMPILING DATA STATE */}
          {isCompiling && <CompilingState />}

          {/* YOU'RE ALL SET UP STATE */}
          {isCompleted && <CompletedState />}
        </div>
      </div>

      {/* CRISIS ESCALATION MODAL (Sensitive content guard) */}
      {crisisAlert && <CrisisModal setCrisisAlert={setCrisisAlert} setExpressionText={setExpressionText} />}
    </div>
  );
}
