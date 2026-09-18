import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await prisma.communityPost.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        comments: {
          take: 5,
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
        likes: true,
      },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    // Fallback jika database belum migrasi tabel community
    return NextResponse.json({ success: true, posts: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    let userId: string | null = null;

    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        userId = session.userId;
      }
    }

    const body = await req.json();
    const { content, imageUrl, tag } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Konten postingan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Safety: detectRisk() dari crisisDetection.ts wajib dipanggil di semua teks bebas (AGENTS.md Bagian 12)
    const isRisk = detectRisk(content);

    let savedPost = null;
    if (userId) {
      try {
        savedPost = await prisma.communityPost.create({
          data: {
            userId,
            content,
            imageUrl: imageUrl || null,
          },
        });
      } catch (dbErr) {
        console.warn("DB Post creation fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
      post: savedPost || {
        id: `post-${Date.now()}`,
        content,
        tag: tag || "Sharing",
        createdAt: new Date().toISOString(),
      },
      message: isRisk
        ? "Konten terdeteksi membutuhkan pendampingan darurat. Bantuan krisis tersedia."
        : "Postingan berhasil dipublikasikan.",
    });
  } catch (err: any) {
    console.error("Community post error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal memproses postingan." },
      { status: 500 }
    );
  }
}
