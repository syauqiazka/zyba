import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZYBA — Gen Z Wellness Support",
  description:
    "Pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 max-w-[1280px] mx-auto px-10 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
