import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, verifyOTP } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, otp, name, password, provider = "EMAIL" } = body;

    if (action === "SIGNUP") {
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

      // Generate OTP
      const otpCode = generateOTP(email);

      // For demo: return OTP in response (in production, send via email)
      return NextResponse.json({
        success: true,
        message: "OTP dikirim ke email. Silakan verifikasi.",
        demoCode: otpCode,
      });
    }

    if (action === "VERIFY_OTP") {
      const result = verifyOTP(email, otp);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      // Create user after OTP verification
      const user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          passwordHash: password || "demo_password",
          onboardingCompleted: false,
        },
      });

      // Create notification preferences
      await prisma.notificationPref.create({
        data: {
          userId: user.id,
        },
      });

      // Create session token
      const sessionToken = `demo_${user.id}`;

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
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    if (action === "LOGIN") {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Email tidak terdaftar" },
          { status: 401 }
        );
      }

      // For demo: accept any password
      const sessionToken = `demo_${user.id}`;

      const response = NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name },
        token: sessionToken,
      });

      response.cookies.set("auth-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    return NextResponse.json({ error: "Action tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}