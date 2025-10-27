import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import User from "@/models/User";

const Address = z.object({
  street: z.string().optional(),
  city:   z.string().optional(),
  state:  z.string().optional(),
  zip:    z.string().optional(),
}).partial();

const CardInput = z.object({
  cardType: z.string().optional(),      
  cardNumber: z.string().optional(),   
  expiration: z.string().optional(),   
  billingAddress: Address.optional()  
});

const Body = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Phone must be 10–15 digits"), 
  password: z.string().min(8, "Password must be at least 8 chars"),
  promoOptIn: z.boolean().optional(),
  homeAddress: Address.optional(),
  cards: z.array(CardInput).max(3).optional(),
}); 

function sixDigitCode() {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

async function sendEmail({ to, subject, html }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log("[DEV email]", { to, subject, html });         
    return;
  }
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST, port: Number(SMTP_PORT || 587), secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    await transporter.sendMail({ from: EMAIL_FROM || SMTP_USER, to, subject, html });
   } //sendEmail

  export async function POST(req) {
  await connectDB();

  try {
    // Parse & validate
    const input = Body.parse(await req.json());
    const { name, email, phone, password, promoOptIn = false } = input;

    // Uniqueness
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Secrets & verification
    const passwordHash = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(24).toString("hex");
    const code = sixDigitCode();
    const codeHash = await bcrypt.hash(code, 10);
    const confirmationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    // Optional home/shipping address (drop if empty)
    const homeAddress =
      input.homeAddress && Object.values(input.homeAddress).some(Boolean)
        ? {
            street: input.homeAddress.street?.trim(),
            city:   input.homeAddress.city?.trim(),
            state:  input.homeAddress.state?.trim(),
            zip:    input.homeAddress.zip?.trim(),
          }
        : undefined;

    // Optional payments (<=3); keep only non-empty rows
    let payments;
    if (Array.isArray(input.cards) && input.cards.length) {
      payments = input.cards
        .slice(0, 3)
        .map(c => {
          const type = c.cardType?.trim();
          const num  = c.cardNumber?.trim();
          const exp  = c.expiration?.trim();
          const bill = c.billingAddress?.trim();   // <-- string
          return (type || num || exp) ? { cardType: type, cardNumber: num, expiration: exp, billingAddress: bill } : null;
        })
        .filter(Boolean);
      if (!payments.length) payments = undefined;
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      passwordHash,
      promoOptIn: !!promoOptIn,
      status: "Inactive",
      confirmationToken: token,
      confirmationCodeHash: codeHash,
      confirmationExpires,
      homeAddress,     // <-- store optional shipping/home address here
      payments,        // <-- array of cards with billingAddress (string)
    });

    const base = process.env.APP_BASE_URL || "http://localhost:3000";
    const link = `${base}/api/auth/confirm?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Confirm your CES account",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for registering at CES.</p>
        <p><strong>Your verification code:</strong>
           <code style="font-size:18px">${code}</code></p>
        <p>You can either enter this code on the verification page, or click this link:</p>
        <p><a href="${link}">Confirm my account</a> (expires in 24 hours)</p>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "Registered. Check your email for the code/confirmation link.",
      userId: user._id,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Registration failed" }, { status: 400 });
  }
}
