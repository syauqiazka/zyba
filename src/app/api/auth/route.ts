import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, verifyOTP, sendOTPEmail } from "@/lib/emailService";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, otp, name, password } = body;

    if (action === "SIGNUP") {
      if (!email) {
        return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email sudah terdaftar. Silakan login." },
          { status: 400 }
        );
      }

      // Generate OTP and send via email service
      const otpCode = generateOTP(email);
      await sendOTPEmail(email, otpCode);

      // Security: demoCode dihapus dari response API sesuai AGENTS.md Bagian 8.3
      return NextResponse.json({
        success: true,
        message: "OTP dikirim ke email. Silakan verifikasi.",
      });
    }

    if (action === "VERIFY_OTP") {
      if (!email || !otp) {
        return NextResponse.json({ error: "Email dan OTP wajib diisi." }, { status: 400 });
      }

      const result = verifyOTP(email, otp);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      // Security: Hash password dengan bcrypt (AGENTS.md Bagian 8.1)
      const passwordToHash = password || "demo_password";
      const passwordHash = await bcrypt.hash(passwordToHash, 12);

      // Create user after OTP verification
      const user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          passwordHash,
          onboardingCompleted: false,
        },
      });

      // Create notification preferences
      await prisma.notificationPref.create({
        data: {
          userId: user.id,
        },
      });

      // Security: Ganti token yang mudah ditebak dengan token signed JWT (AGENTS.md Bagian 8.2)
      const sessionToken = await createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
      });

      const response = NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name },
        token: sessionToken,
      });

      // Set auth cookie
      response.cookies.set("auth-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    if (action === "LOGIN") {
      if (!email) {
        return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Email tidak terdaftar" },
          { status: 401 }
        );
      }

      // Security: Validasi password dengan bcrypt.compare (AGENTS.md Bagian 8.1)
      const inputPassword = password || "";
      let valid = false;
      try {
        valid = await bcrypt.compare(inputPassword, user.passwordHash);
      } catch {
        valid = false;
      }

      // Fallback migrasi jika user dibuat sebelum password di-hash
      if (!valid && user.passwordHash === inputPassword) {
        valid = true;
        const newHash = await bcrypt.hash(inputPassword, 12);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash },
        });
      }

      if (!valid) {
        return NextResponse.json({ error: "Password salah" }, { status: 401 });
      }

      // Security: Ganti session token dengan signed JWT (AGENTS.md Bagian 8.2)
      const sessionToken = await createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
      });

      const response = NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name },
        token: sessionToken,
      });

      response.cookies.set("auth-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    return NextResponse.json({ error: "Action tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}