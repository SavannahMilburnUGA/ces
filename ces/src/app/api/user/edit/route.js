// /app/api/user/edit/route.js
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sendEmail } from "@/lib/email";

export async function PUT(req) {
  await connectMongoDB();

  const cookieStore = await cookies();
  const session = cookieStore.get("userSession");
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  //Parse userId from session (make sure your login route sets _id in cookie)
  const { _id: userId } = JSON.parse(session.value);
  if (!userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const updates = await req.json();

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

  // Update address
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

  //Send email if profile changed
  if (changed) {
    try {
      await sendEmail({
        to: user.email,
        subject: "Profile Updated",
        text: `Hi ${user.name},\n\nYour profile information has been updated successfully.`,
      });
      console.log("Profile update email sent successfully to", user.email);
    } catch (err) {
      console.error("Profile update email failed:", err);
    }
  }

  return NextResponse.json({ message: "Profile updated successfully." });
}
