"use client"; 
import { useState } from "react";

export default function CodeVerificationPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg({ type: "", text: "" });
    try {
      const r = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Invalid code");
      setMsg({ type: "success", text: data.message || "Verified!" });
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally { setBusy(false); }
  }

  return (
    <div className="page">
      <h1 className="mb-3">Enter your verification code</h1>
      {msg.text && <p style={{ color: msg.type === "error" ? "crimson" : "green" }}>{msg.text}</p>}
      <form className="form" onSubmit={submit}>
        <label className="field">
          <span className="label">Email</span>
          <input className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span className="label">6-digit code</span>
          <input className="input" inputMode="numeric" pattern="\\d{6}" required
                 value={code} onChange={e=>setCode(e.target.value)} />
        </label>
        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>{busy ? "Verifying…" : "Verify"}</button>
        </div>
      </form>
    </div>
  );
}