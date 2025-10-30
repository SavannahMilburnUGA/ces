import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { email, token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return NextResponse.json({ error: "token and newPassword are required" }, { status: 400 });
    }

    // Optional policy
    if (String(newPassword).length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const now = new Date();
    let user = null;

    // Fast path if email is present
    if (email) {
      user = await User.findOne({ email: String(email).toLowerCase() });
    }

    // Token-only path (works even if email missing/garbled)
    if (!user) {
      // Only scan users that currently have a **non-expired** reset token
      const candidates = await User.find({
        resetPasswordTokenHash: { $exists: true, $ne: null },
        resetPasswordExpires: { $gt: now },
      }).select("email name resetPasswordTokenHash resetPasswordExpires");

      for (const u of candidates) {
        if (await bcrypt.compare(String(token), u.resetPasswordTokenHash)) {
          user = u;
          break;
        }
      }
    }

    // Final validation
    if (
      !user ||
      !user.resetPasswordTokenHash ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < now
    ) {
      return NextResponse.json({ error: "Reset link is invalid or expired" }, { status: 400 });
    }

    // Update password and clear reset fields
    user.passwordHash = await bcrypt.hash(String(newPassword), 10);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Optional notify
    try {
      await sendEmail({
        to: user.email,
        subject: "Your CES password was changed",
        html: `<p>Hi ${user.name || "there"},</p><p>Your password has been updated.</p>`,
      });
    } catch {
      // don't fail reset if email notify has an issue
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RESET ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
