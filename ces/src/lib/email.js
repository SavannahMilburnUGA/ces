import nodemailer from "nodemailer";

const t = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: String(process.env.SMTP_SECURE ?? "true") === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendEmail(options) {
  return t.sendMail({ from: process.env.FROM_EMAIL || process.env.SMTP_USER, ...options });
}