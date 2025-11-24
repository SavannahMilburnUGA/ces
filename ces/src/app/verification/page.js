"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [resending, setResending] = useState(false);

  // Require email in the query; if missing, go back to /register
  useEffect(() => {
    const e = params.get("email");
    if (!e) {
      router.replace("/register");
      return;
    }
    setEmail(e);
  }, [params, router]);

  async function submit(e) {
    e.preventDefault();
    if (!email) return; // safety
    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      const r = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Invalid code");
      setMsg({ type: "success", text: data.message || "Account verified!" });
      router.push("/login") // if you want auto-nav after success
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Verification failed" });
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (!email) return;
    setResending(true);
    setMsg({ type: "", text: "" });
    try {
      const r = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not resend email");
      setMsg({
        type: "success",
        text:
          data.message ||
          "We sent a new verification email with your code and link.",
      });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Resend failed" });
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-dvh bg-white text-slate-900 flex items-start justify-center p-6">
      <section className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold">Verify your account</h1>
        <p className="text-sm text-slate-600 mt-1">
          We sent a 6-digit code and a confirmation link to{" "}
          <span className="font-medium">{email || "your email"}</span>.
        </p>

        {msg.text && (
          <div
            className={`mt-4 rounded-md px-3 py-2 text-sm ${
              msg.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 grid gap-4">
          {/* Email: locked / non-editable */}
          <label className="flex flex-col gap-1">
            <span className="text-sm">Email</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-100 text-slate-500"
              type="email"
              value={email}
              readOnly
              disabled
              aria-readonly="true"
            />
          
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">6-digit code</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 tracking-widest"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
            />
            <span className="text-xs text-slate-500">
              Or click the confirmation link in the email.
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={busy || !email}
            >
              {busy ? "Verifying…" : "Verify"}
            </button>

            <button
              type="button"
              onClick={resend}
              className="text-sm text-slate-700 hover:text-black underline underline-offset-2 disabled:opacity-50"
              disabled={resending || !email}
              title={!email ? "Email missing" : "Resend email"}
            >
              {resending ? "Sending…" : "Resend email"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

