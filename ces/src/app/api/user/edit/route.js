// /app/api/user/edit/route.js
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import sendEmail from "@/lib/email"; // your email util

export async function PUT(req) {
  await connectMongoDB();

  const cookieStore = cookies();
  const session = cookieStore.get("userSession");
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const updates = await req.json();
  const userId = JSON.parse(session.value)._id; // assuming session stores {_id, name, email}

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let changed = false;

  // Update name
  if (updates.name && updates.name !== user.name) {
    user.name = updates.name;
    changed = true;
  }

  // Update promoOptIn
  if (typeof updates.promoOptIn === "boolean" && updates.promoOptIn !== user.promoOptIn) {
    user.promoOptIn = updates.promoOptIn;
    changed = true;
  }

  // Update address (only one allowed)
  if (updates.homeAddress) {
    user.homeAddress = updates.homeAddress;
    changed = true;
  }

  // Update payments (max 3)
  if (updates.payments) {
    if (updates.payments.length > 3) {
      return NextResponse.json({ error: "You can store at most 3 payment cards." }, { status: 400 });
    }
    user.payments = updates.payments;
    changed = true;
  }

  // Handle password change
  if (updates.newPassword) {
    if (!updates.currentPassword) {
      return NextResponse.json({ error: "Current password required to change password." }, { status: 400 });
    }
    const match = await bcrypt.compare(updates.currentPassword, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    user.passwordHash = await bcrypt.hash(updates.newPassword, 10);
    changed = true;
  }

  if (changed) user.lastProfileUpdate = new Date();
  await user.save();

  // Send email if profile changed
  if (changed) {
    sendEmail({
      to: user.email,
      subject: "Profile Updated",
      text: "Your profile information has been updated successfully.",
    });
  }

  return NextResponse.json({ message: "Profile updated successfully." });
}
