import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.confirmationCodeHash || !user.confirmationExpires) {
      return NextResponse.json(
        { error: "No pending verification" },
        { status: 400 }
      );
    }

    if (user.confirmationExpires < new Date()) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 });
    }

    const ok = await bcrypt.compare(code, user.confirmationCodeHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    user.status = "Active";
    user.confirmationCodeHash = undefined;
    user.confirmationToken = undefined;
    user.confirmationExpires = undefined;
    await user.save();

    return NextResponse.json({ ok: true, message: "Account verified" });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Verification failed" }, { status: 500 });
  }
}
