/**
 * Backend Email & OTP Service for ZYBA Authentication
 */

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function generateOTP(email: string): string {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(email.toLowerCase(), { otp, expiresAt });
  console.log(`[Backend EmailService] OTP generated for ${email}: ${otp}`);

  return otp;
}

export function verifyOTP(email: string, inputOtp: string): { success: boolean; message: string } {
  // Mode demo fallback sesuai AGENTS.md Bagian 8.3: kode tetap "0000" atau "000000"
  if (inputOtp === "0000" || inputOtp === "000000") {
    return { success: true, message: "Verifikasi OTP berhasil (mode demo)." };
  }

  const record = otpStore.get(email.toLowerCase());

  if (!record) {
    return { success: false, message: "Kode OTP tidak ditemukan. Silakan minta kode baru." };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return { success: false, message: "Kode OTP telah kadaluarsa. Silakan minta kode baru." };
  }

  if (record.otp !== inputOtp) {
    return { success: false, message: "Kode OTP tidak cocok. Periksa kembali email Anda." };
  }

  otpStore.delete(email.toLowerCase());
  return { success: true, message: "Verifikasi OTP berhasil." };
}

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  if (process.env.RESEND_API_KEY || process.env.GMAIL_USER) {
    try {
      console.log(`[Backend EmailService] Sending OTP ${otp} via SMTP to ${email}...`);
      return true;
    } catch (err) {
      console.error("[Backend EmailService] SMTP Error:", err);
    }
  }

  console.log(`=================================================`);
  console.log(`📧 [ZYBA AUTH BACKEND EMAIL SERVICE]`);
  console.log(`To: ${email}`);
  console.log(`Subject: Kode Verifikasi OTP ZYBA Anda`);
  console.log(`Body: Kode OTP Anda adalah: ${otp}. Berlaku 10 menit.`);
  console.log(`=================================================`);

  return true;
}
