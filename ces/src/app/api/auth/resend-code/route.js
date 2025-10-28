import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email"; // see helper below

const sixDigitCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req) {
  await connectDB();
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.status === "Active") {
      return NextResponse.json({ error: "Account already verified" }, { status: 400 });
    }

    const token = crypto.randomBytes(24).toString("hex");
    const code = sixDigitCode();
    const codeHash = await bcrypt.hash(code, 10);
    const confirmationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    user.confirmationToken = token;
    user.confirmationCodeHash = codeHash;
    user.confirmationExpires = confirmationExpires;
    await user.save();

    const base = process.env.APP_BASE_URL || "http://localhost:3000";
    const link = `${base}/api/auth/confirm?token=${token}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Your CES verification code",
        html: `
          <p>Hi ${user.name || ""},</p>
          <p>Your new verification code is
            <strong style="font-size:18px;letter-spacing:2px">${code}</strong>.
          </p>
          <p>You may also confirm by clicking this link:</p>
          <p><a href="${link}">Confirm my account</a> (expires in 24 hours)</p>
        `,
      });
    } catch (err) {
      console.error("Resend email failed:", err);
      // still return success to avoid blocking UX in class project setups
    }

    return NextResponse.json({ ok: true, message: "Verification email resent." });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Resend failed" }, { status: 400 });
  }
}
