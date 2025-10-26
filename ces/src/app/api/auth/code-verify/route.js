import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/src/lib/mongodb";
import User from "@/src/models/User";


const Body = z.object({
  email: z.string().email(),
  code: z.string().length(6)
});

function newCustomerId() {
  const n = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CUS-${n}`;
}

export async function POST(req) {
  await connectDB();
  try {
    const { email, code } = Body.parse(await req.json());
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "No account found under this email." }, { status: 404 });
    if (user.status === "Active") return NextResponse.json({ ok: true, message: "This account is already verified" });

    if (!user.confirmationCodeHash || !user.confirmationExpires || user.confirmationExpires < new Date()) {
      return NextResponse.json({ error: "Code expired. Please Re-register." }, { status: 400 });
    }
    const ok = await bcrypt.compare(code, user.confirmationCodeHash);
    if (!ok) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    user.status = "Active";
    user.confirmationToken = undefined;
    user.confirmationCodeHash = undefined;
    user.confirmationExpires = undefined;
    if (!user.customerId) user.customerId = newCustomerId();
    await user.save();

    return NextResponse.json({ ok: true, message: "Your email is verified." });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Verification failed" }, { status: 400 });
  }
}