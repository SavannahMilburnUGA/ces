import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email"; // your nodemailer helper

export async function POST(req) {
  await connectMongoDB();

  const { email } = await req.json();
  // Always respond 200 to avoid leaking which emails exist
  const user = email ? await User.findOne({ email: String(email).toLowerCase() }) : null;
  if (!user) return NextResponse.json({ ok: true });

  // Create a token and store its HASH + expiry (30 minutes)
  const token = crypto.randomBytes(24).toString("hex");
  user.resetPasswordTokenHash = await bcrypt.hash(token, 10);
  user.resetPasswordExpires   = new Date(Date.now() + 1000 * 60 * 30);
  await user.save();

  // Build link
  const base = process.env.APP_BASE_URL || "http://localhost:3000";
  const link = `${base}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`;

  // Send email
  await sendEmail({
    to: user.email,
    subject: "Reset your CES password",
    html: `
      <p>Hi ${user.name || "there"},</p>
      <p>Click the link below to reset your password (expires in 30 minutes):</p>
      <p><a href="${link}">${link}</a></p>
    `,
  });

  return NextResponse.json({ ok: true });
}

