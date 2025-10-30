"use client";
import { useEffect, useState } from "react";

export default function EditProfile() {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    homeAddress: { street: "", city: "", state: "", zip: "" },
    payments: [],
    promoOptIn: false,
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  // Fetch user info
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/profile", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        const [firstName, ...lastParts] = (data.name || "").trim().split(" ");
        setForm({
          email: data.email,
          firstName: firstName || "",
          lastName: lastParts.join(" ") || "",
          homeAddress: data.homeAddress || { street: "", city: "", state: "", zip: "" },
          payments: data.payments || [],
          promoOptIn: data.promoOptIn || false,
          currentPassword: "",
          newPassword: "",
        });
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;

    // homeAddress
    if (dataset.address) {
      setForm({
        ...form,
        homeAddress: { ...form.homeAddress, [dataset.address]: value },
      });
      return;
    }

    // payments array
    if (dataset.paymentIndex !== undefined) {
      const index = parseInt(dataset.paymentIndex, 10);
      const field = dataset.paymentField;
      const updatedPayments = [...form.payments];
      updatedPayments[index] = { ...updatedPayments[index], [field]: value };
      setForm({ ...form, payments: updatedPayments });
      return;
    }

    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const addPayment = () => {
    if (form.payments.length >= 3) return;
    setForm({
      ...form,
      payments: [...form.payments, { cardType: "", cardNumber: "", expiration: "", billingAddress: "" }],
    });
  };

  const removePayment = (index) => {
    const updatedPayments = [...form.payments];
    updatedPayments.splice(index, 1);
    setForm({ ...form, payments: updatedPayments });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: `${form.firstName} ${form.lastName}`,
      homeAddress: form.homeAddress,
      payments: form.payments,
      promoOptIn: form.promoOptIn,
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    };
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-full max-w-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Edit Profile</h2>

        <label>Email (read-only)</label>
        <input value={form.email} disabled className="w-full p-2 rounded bg-gray-700 text-gray-300" />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full p-2 rounded bg-gray-700" />
          </div>
          <div>
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full p-2 rounded bg-gray-700" />
          </div>
        </div>

        <h3 className="font-semibold mt-4">Home Address</h3>
        {["street", "city", "state", "zip"].map((field) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              value={form.homeAddress[field]}
              onChange={handleChange}
              data-address={field}
              className="w-full p-2 rounded bg-gray-700"
            />
          </div>
        ))}

        <h3 className="font-semibold mt-4">Payment Cards</h3>
        {form.payments.map((card, index) => (
          <div key={index} className="border p-2 rounded mb-2 space-y-2">
            <input
              value={card.cardType}
              onChange={handleChange}
              data-payment-index={index}
              data-payment-field="cardType"
              placeholder="Card Type"
              className="w-full p-2 rounded bg-gray-700"
            />
            <input
              value={card.cardNumber}
              onChange={handleChange}
              data-payment-index={index}
              data-payment-field="cardNumber"
              placeholder="Card Number"
              className="w-full p-2 rounded bg-gray-700"
            />
            <input
              value={card.expiration}
              onChange={handleChange}
              data-payment-index={index}
              data-payment-field="expiration"
              placeholder="MM/YY"
              className="w-full p-2 rounded bg-gray-700"
            />
            <input
              value={card.billingAddress}
              onChange={handleChange}
              data-payment-index={index}
              data-payment-field="billingAddress"
              placeholder="Billing Address"
              className="w-full p-2 rounded bg-gray-700"
            />
            <button type="button" onClick={() => removePayment(index)} className="bg-red-600 hover:bg-red-700 p-1 rounded w-full">
              Remove Card
            </button>
          </div>
        ))}
        {form.payments.length < 3 && (
          <button type="button" onClick={addPayment} className="w-full bg-green-600 hover:bg-green-700 p-2 rounded">
            Add Card
          </button>
        )}

        <div>
          <label>Promo Emails</label>
          <input type="checkbox" name="promoOptIn" checked={form.promoOptIn} onChange={handleChange} className="ml-2" />
        </div>

        <h3 className="font-semibold mt-4">Change Password</h3>
        <input
          name="currentPassword"
          type="password"
          placeholder="Current Password"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />
        <input
          name="newPassword"
          type="password"
          placeholder="New Password"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">
          Save Changes
        </button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}