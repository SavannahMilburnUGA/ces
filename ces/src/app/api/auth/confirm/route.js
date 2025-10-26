import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import User from "@/src/models/User";


function newCustomerId() {
  const n = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CUS-${n}`;
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const user = await User.findOne({
    confirmationToken: token,
    confirmationExpires: { $gt: new Date() }
  });

  if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  user.status = "Active";
  user.confirmationToken = undefined;
  user.confirmationCodeHash = undefined;
  user.confirmationExpires = undefined;
  if (!user.customerId) user.customerId = newCustomerId();
  await user.save();

  return NextResponse.redirect(new URL("/register/confirmed", req.url));
}