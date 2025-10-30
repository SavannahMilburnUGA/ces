import nodemailer from "nodemailer";

let cached = global._mailer;

async function getTransporter() {
  if (cached) return cached;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const hasSecureEnv = typeof process.env.SMTP_SECURE !== "undefined";
  const secure = hasSecureEnv ? String(process.env.SMTP_SECURE) === "true" : (port === 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  await transporter.verify().catch((e) => {
    console.error("[mail] verify failed:", e?.response || e?.message || e);
    throw e;
  });

  global._mailer = transporter;
  return transporter;
}

export async function sendEmail(options) {
  const transporter = await getTransporter();
  const from = process.env.SMTP_FROM || process.env.FROM_EMAIL || process.env.SMTP_USER;
  return transporter.sendMail({ from, ...options });
}
