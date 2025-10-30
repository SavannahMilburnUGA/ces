import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: "token, email and newPassword are required" },
        { status: 400 }
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Find by email first (prevents matching the wrong user)
    const user = await User.findOne({
      email: String(email).toLowerCase(),
      resetPasswordTokenHash: { $exists: true, $ne: null },
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired" },
        { status: 400 }
      );
    }

    // Compare the raw token with the stored hash
    const ok = await bcrypt.compare(String(token), user.resetPasswordTokenHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired" },
        { status: 400 }
      );
    }

    // All good – update password and clear the reset fields
    user.passwordHash = await bcrypt.hash(String(newPassword), 10);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Best-effort notify
    try {
      await sendEmail({
        to: user.email,
        subject: "Your CES password was changed",
        html: `<p>Hi ${user.name || "there"},</p><p>Your password was updated.</p>`,
      });
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("reset error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
