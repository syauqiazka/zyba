import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";

// NOTE: demo memakai user pertama di database sebagai pengganti session.
// Ganti dengan user dari sistem auth (mis. getServerSession) di implementasi nyata.
async function getCurrentUserId() {
  const user = await prisma.user.findFirst({ select: { id: true } });
  if (!user) throw new Error("No user found — seed database dulu.");
  return user.id;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { mood, note } = body as { mood: string; note?: string };

  if (!mood) {
    return NextResponse.json({ error: "Mood wajib diisi" }, { status: 400 });
  }

  const userId = await getCurrentUserId();

  const entry = await prisma.moodEntry.create({
    data: { userId, mood: mood as any, note },
  });

  // Kalau catatan bebas terindikasi risiko, kembalikan info krisis
  // supaya UI bisa menampilkannya langsung ke pengguna, terpisah dari
  // alur "mood berhasil disimpan" yang biasa.
  const risk = note ? detectRisk(note) : false;

  return NextResponse.json({
    entry,
    risk,
    crisisResources: risk ? CRISIS_RESOURCES : null,
  });
}

export async function GET() {
  const userId = await getCurrentUserId();
  const entries = await prisma.moodEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json({ entries });
}
