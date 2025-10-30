"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    await fetch("/api/password/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    setMsg("If the email exists, a reset link has been sent.");
    setBusy(false);
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Forgot password</h1>
      {msg && <div className="mb-4 text-green-700">{msg}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2"
                 value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <button disabled={busy} className="w-full bg-black text-white rounded px-4 py-2">
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </main>
  );
}
