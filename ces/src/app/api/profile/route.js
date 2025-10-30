import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";

import User from "../../../models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function PUT(req) {
  try {
    await connectDB();

    const {
      name,
      phone,
      homeAddress,
      payments,
      promoOptIn,
      currentPassword,
      newPassword,
    } = await req.json();

    //assuming you can get email from the session
    const email = req.headers.get("x-user-email");
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let updatedFields = {};
    let emailContent = "";

    // Update name
    if (name && name !== user.name) {
      updatedFields.name = name;
      emailContent += `Name updated to: ${name}\n`;
    }

    // Update phone
    if (phone && phone !== user.phone) {
      updatedFields.phone = phone;
      emailContent += `Phone updated to: ${phone}\n`;
    }

    // Update home address
    if (homeAddress) {
      updatedFields.homeAddress = homeAddress;
      emailContent += `Home address updated.\n`;
    }

    // Update payment cards
    if (payments) {
      if (!Array.isArray(payments)) {
        return NextResponse.json({ error: "Payments must be an array" }, { status: 400 });
      }
      if (payments.length > 3) {
        return NextResponse.json({ error: "Cannot store more than 3 payment cards" }, { status: 400 });
      }
      updatedFields.payments = payments;
      emailContent += `Payment card information updated.\n`;
    }

    // Update promoOptIn
    if (typeof promoOptIn === "boolean" && promoOptIn !== user.promoOptIn) {
      updatedFields.promoOptIn = promoOptIn;
      emailContent += `Promo preference updated to: ${promoOptIn}\n`;
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password required to set a new password" }, { status: 400 });
      }
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }
      updatedFields.passwordHash = await bcrypt.hash(newPassword, 10);
      emailContent += `Password changed.\n`;
    }

    // Apply updates
    Object.assign(user, updatedFields);
    await user.save();

    // Send email notification if anything changed
    if (emailContent) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: "Profile Updated",
        text: `Hi ${user.name}, your profile has been updated:\n\n${emailContent}`,
      });
    }

    return NextResponse.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}