"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ResetPasswordPage() {
  const sp = useSearchParams();
  const router = useRouter();

  // Read both values from the link ?token=...&email=...
  const token = useMemo(() => sp.get("token") || "", [sp]);
  const email = useMemo(() => sp.get("email") || "", [sp]);

  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!token || !email) {
      setMsg({ type: "error", text: "Reset link is missing token/email" });
      return;
    }
    if (pwd.length < 8) {
      setMsg({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    setBusy(true);
    const res = await fetch("/api/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, newPassword: pwd }),
    });

    let data = {};
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      setMsg({ type: "error", text: data.error || "Reset failed" });
    } else {
      setMsg({ type: "success", text: "Password reset! Redirecting to login…" });
      setTimeout(() => router.push("/login"), 1200);
    }

    setBusy(false);
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Set a new password</h1>

      {msg.text && (
        <div className={msg.type === "error" ? "text-red-600 mb-4" : "text-green-700 mb-4"}>
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        {/* Show the email as read-only to avoid tampering */}
        <div>
          <label className="block text-sm mb-1">Account email</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700"
            value={email}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm mb-1">New password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
        </div>

        <button disabled={busy} className="w-full bg-black text-white rounded px-4 py-2">
          {busy ? "Saving…" : "Set new password"}
        </button>
      </form>
    </main>
  );
}
