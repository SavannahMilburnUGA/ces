
"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg({ type: "", text: "" });
    const r = await fetch("/api/password/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    // Always treat as success to avoid enumeration
    setBusy(false);
    setMsg({ type: "success", text: "If the email exists, a reset link has been sent." });
  }

  return (
    <main className="min-h-dvh grid place-items-center bg-gray-100">
      <section className="bg-white w-full max-w-md rounded-2xl shadow-md p-8 text-black">
        <h1 className="text-2xl font-semibold mb-6 text-center">Forgot password</h1>
        {msg.text && (
          <div className={`mb-4 rounded-md px-3 py-2 text-sm ${msg.type==="success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.text}
          </div>
        )}
        <form onSubmit={submit} className="grid gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="border rounded-lg p-3"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={busy}>
            {busy ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <p className="text-center text-sm mt-3">
          Remembered your password? <a href="/login" className="text-blue-600 hover:underline">Back to login</a>
        </p>
      </section>
    </main>
  );
}
