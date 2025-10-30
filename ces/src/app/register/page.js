"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function RegisterPage() {
  const router = useRouter();               

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    promoOptIn: false,
    homeAddress: { street: "", city: "", state: "", zip: "" },
    cards: [
      {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        cardType: "",
        cardNumber: "",
        expiration: "",
        billingAddress: "",
      },
    ],
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const upd  = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const upda = (scope, key, value) =>
    setForm((p) => ({ ...p, [scope]: { ...(p[scope] || {}), [key]: value } }));
  const updCard = (i, key, value) =>
    setForm((p) => {
      const cards = p.cards.slice();
      cards[i] = { ...cards[i], [key]: value };
      return { ...p, cards };
    });

  const addCard = () =>
    setForm((p) =>
      p.cards.length >= 3
        ? p
        : {
            ...p,
            cards: [
              ...p.cards,
              {
                id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()),
                cardType: "",
                cardNumber: "",
                expiration: "",
                billingAddress: "",
              },
            ],
          }
    );

  const removeCard = (i) =>
    setForm((p) => ({ ...p, cards: p.cards.filter((_, idx) => idx !== i) }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });

    try {
      const homeAddress =
        form.homeAddress && Object.values(form.homeAddress).some(Boolean)
          ? {
              street: form.homeAddress.street?.trim(),
              city: form.homeAddress.city?.trim(),
              state: form.homeAddress.state?.trim(),
              zip: form.homeAddress.zip?.trim(),
            }
          : undefined;

      const cards = form.cards
        .map(({ cardType, cardNumber, expiration, billingAddress }) => {
          const card = {
            cardType: cardType?.trim(),
            cardNumber: cardNumber?.trim(),
            expiration: expiration?.trim(),
            billingAddress: billingAddress?.trim(),
          };
          return card.cardType || card.cardNumber || card.expiration ? card : null;
        })
        .filter(Boolean);

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        promoOptIn: form.promoOptIn,
        homeAddress,
        cards,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

     
      router.push(`/verification?email=${encodeURIComponent(form.email)}`);
      return;

     

    } catch (e) {
      setMsg({ type: "error", text: e.message || "Something went wrong" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-white text-slate-100 flex items-start justify-center p-6">
      <section className="text-black w-full max-w-4xl bg-white border border-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-black">Create Account</h1>
        {msg.text && (
          <p style={{ color: msg.type === "error" ? "crimson" : "green" }}>
            {msg.text}
          </p>
        )}

        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          {/* Account */}
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm">Full name*</span>
            <input
              className="w-full rounded-lg border border-black px-3 py-2"
              required
              value={form.name}
              onChange={(e) => upd("name", e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Email*</span>
            <input
              className="w-full rounded-lg border border-black px-3 py-2"
              type="email"
              required
              value={form.email}
              onChange={(e) => upd("email", e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Phone*</span>
            <input
              className="w-full rounded-lg border border-black px-3 py-2"
              placeholder="+14045551234"
              required
              value={form.phone}
              onChange={(e) => upd("phone", e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm">Password* (min 8)</span>
            <input
              className="w-full rounded-lg border border-black px-3 py-2"
              type="password"
              minLength={8}
              required
              value={form.password}
              onChange={(e) => upd("password", e.target.value)}
            />
            <span className="text-xs text-slate-500">At least 8 characters</span>
          </label>

          <label className="md:col-span-2 inline-flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={form.promoOptIn}
              onChange={(e) => upd("promoOptIn", e.target.checked)}
            />
            <span className="text-sm">Send me promos</span>
          </label>

          {/* Home/Shipping address (optional) */}
          <h2 className="md:col-span-2 mt-4 text-lg font-semibold">
            Home / Shipping Address (optional)
          </h2>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm">Street</span>
            <input
              className="rounded border px-3 py-2"
              value={form.homeAddress?.street ?? ""}
              onChange={(e) => upda("homeAddress", "street", e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">City</span>
            <input
              className="rounded border px-3 py-2"
              value={form.homeAddress?.city ?? ""}
              onChange={(e) => upda("homeAddress", "city", e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">State</span>
            <input
              className="rounded border px-3 py-2"
              value={form.homeAddress?.state ?? ""}
              onChange={(e) => upda("homeAddress", "state", e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Zip</span>
            <input
              className="rounded border px-3 py-2"
              value={form.homeAddress?.zip ?? ""}
              onChange={(e) => upda("homeAddress", "zip", e.target.value)}
            />
          </label>

          {/* Payment cards (optional, max 3) */}
          <div className="md:col-span-2 mt-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Payment Cards (optional — up to 3)
            </h2>
            <button
              type="button"
              className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
              onClick={addCard}
              disabled={form.cards.length >= 3}
            >
              + Add card
            </button>
          </div>

          {form.cards.map((c, i) => (
            <div key={c.id} className="md:col-span-2 rounded border p-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Card type</span>
                  <input
                    className="rounded border px-3 py-2"
                    placeholder="Visa / Mastercard / Amex"
                    value={c.cardType}
                    onChange={(e) => updCard(i, "cardType", e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm">Card number</span>
                  <input
                    className="rounded border px-3 py-2"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={c.cardNumber}
                    onChange={(e) => updCard(i, "cardNumber", e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm">Expiration (MM/DD)</span>
                  <input
                    className="rounded border px-3 py-2"
                    placeholder="MM/DD"
                    autoComplete="cc-exp"
                    value={c.expiration}
                    onChange={(e) => updCard(i, "expiration", e.target.value)}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Billing address (single line)</span>
                <input
                  className="rounded border px-3 py-2"
                  placeholder="e.g., 123 Main St, Athens, GA 30602"
                  value={c.billingAddress}
                  onChange={(e) => updCard(i, "billingAddress", e.target.value)}
                />
              </label>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeCard(i)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove card
                </button>
              </div>
            </div>
          ))}

          <div className="md:col-span-2 mt-2">
            <button
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={busy}
            >
              {busy ? "Submitting…" : "Register"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
