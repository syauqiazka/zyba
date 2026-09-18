import { Suspense } from "react";
import OnboardingPage from "@/app/onboarding/page";

export const metadata = {
  title: "Sign In — ZYBA",
  description: "Masuk ke akun ZYBA Gen Z Wellness Support",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-brown-700">Memuat...</div>}>
      <OnboardingPage />
    </Suspense>
  );
}
