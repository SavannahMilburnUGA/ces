import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  await connectMongoDB();
  const { email } = await req.json();
  const user = email ? await User.findOne({ email: String(email).toLowerCase() }) : null;

  // Always return ok (don’t leak existence)
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(24).toString("hex");
  user.resetPasswordTokenHash = await bcrypt.hash(token, 10);
  user.resetPasswordExpires   = new Date(Date.now() + 1000 * 60 * 30); // 30 min
  await user.save();

  const base = process.env.APP_BASE_URL || "http://localhost:3000";
  const link = `${base}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `<p>Hi ${user.name || "there"},</p>
           <p>Click this link to reset your password (expires in 30 minutes):</p>
           <p><a href="${link}">${link}</a></p>`
  });

  return NextResponse.json({ ok: true });
}
