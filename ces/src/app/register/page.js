"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", promoOptIn: false,
    billingAddress: { street: "", city: "", state: "", zip: "" },
  cards: [{ cardType: "", cardNumber: "", expiration: "" }]
   });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  
  // update top-level fields
  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  // update nested objects (billingAddress)
  const upda = (scope, k, v) =>
    setForm((p) => ({ ...p, [scope]: { ...p[scope], [k]: v } }));
  // update a card field at index i
  const updCard = (i, k, v) =>
    setForm((p) => {
      const cards = p.cards.slice();
      cards[i] = { ...cards[i], [k]: v };
      return { ...p, cards };
    });
  // add/remove card rows (max 3)
  const addCard = () =>
    setForm((p) =>
      p.cards.length >= 3
        ? p
        : { ...p, cards: [...p.cards, { cardType: "", cardNumber: "", expiration: "" }] }
    );
  const removeCard = (i) =>
    setForm((p) => ({ ...p, cards: p.cards.filter((_, idx) => idx !== i) }));

 
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg({ type: "", text: "" });
    try {
      const payload = {
        ...form,
        cards: form.cards
          .map((c) => ({
            cardType: c.cardType?.trim(),
            cardNumber: c.cardNumber?.trim(),
            expiration: c.expiration?.trim(), // "MM/DD" per your spec
          }))
          .filter((c) => c.cardType || c.cardNumber || c.expiration),
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg({ type: "success", text: data.message || "Registered." });

      setForm((f) => ({
        ...f,
        cards: [{ cardType: "", cardNumber: "", expiration: "" }],
      }));
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally { setBusy(false); }
  }

  return (
   <main className  = "min-h-dvh bg-white text-slate-100 flex items-start justify-center p-6"> 
    <section className="text-black w-full max-w-4xl bg-white border border-slate-800 rounded-2xl shadow-xl p-6 md:p-8"> 
      <h1 className="text-2xl font-bold text-black">Create Account</h1>
      {msg.text && <p style={{ color: msg.type === "error" ? "crimson" : "green" }}>{msg.text}</p>}

      <form className="form grid-2" onSubmit={submit}>
        <label className="field col-span-2">
          <span className="label">Full name*</span>
          <input className="w-full rounded-lg border border-black" 
          required value={form.name} 
          onChange={e=>upd("name", e.target.value)} />
        </label>
        <label className="field">
          <span className="label">Email*</span>
          <input className="w-full rounded-lg border border-black" 
          type="email" 
          required value={form.email} 
          onChange={e=>upd("email", e.target.value)} />
        </label>
        <label className="field">
          <span className="label">Phone*</span>
          <input className="w-full rounded-lg border border-black" 
          placeholder="+14045551234" 
          required value={form.phone} 
          onChange={e=>upd("phone", e.target.value)} />
        </label>
        <label className="field col-span-2">
          <span className="label">Password*</span>
          <input className="w-full rounded-lg border border-black" 
          type="password" minLength={8} required
                value={form.password} 
                onChange={e=>upd("password", e.target.value)} />
          <span className="hint">At least 8 characters</span>
        </label>

      {/* Billing address (single) */}
      <input placeholder="Street"
             value={form.billingAddress.street}
             onChange={e=>upda("billingAddress","street",e.target.value)} />
      {/* city/state/zip similarly... */}

      {/* Cards (up to 3) */}
      {form.cards.map((c, i) => (
        <div key={i}>
          <input placeholder="Card type" value={c.cardType} onChange={e=>updCard(i,"cardType",e.target.value)} />
          <input placeholder="Card number" value={c.cardNumber} onChange={e=>updCard(i,"cardNumber",e.target.value)} />
          <input placeholder="Expiration (MM/DD)" value={c.expiration} onChange={e=>updCard(i,"expiration",e.target.value)} />
        </div>
      ))}
        
        <label className="field col-span-2" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.promoOptIn} onChange={e=>upd("promoOptIn", e.target.checked)} />
          <span>Send me promotions and offers</span>
        </label>

        <div className="actions col-span-2">
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" 
          disabled={busy}>{busy ? "Submitting…" : "Register"}</button>
        </div>
      </form>
      </section>
    </main> 
  );
}