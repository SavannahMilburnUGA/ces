"use client";

import { useState, useEffect } from "react";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    homeAddress: { street: "", city: "", state: "", zip: "" },
    payments: [{ cardType: "", cardNumber: "", expiration: "", billingAddress: "" }],
    promoOptIn: false,
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/me");
        if (!res.ok) throw new Error("Failed to fetch user data.");
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          homeAddress: data.homeAddress || { street: "", city: "", state: "", zip: "" },
          payments: data.payments?.length
            ? data.payments
            : [{ cardType: "", cardNumber: "", expiration: "", billingAddress: "" }],
          promoOptIn: data.promoOptIn || false,
        }));
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handlePaymentChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.payments];
      updated[index][field] = value;
      return { ...prev, payments: updated };
    });
  };

  const addPayment = () => {
    if (form.payments.length >= 3) return;
    setForm((prev) => ({
      ...prev,
      payments: [
        ...prev.payments,
        { cardType: "", cardNumber: "", expiration: "", billingAddress: "" },
      ],
    }));
  };

  const removePayment = (index) => {
    setForm((prev) => ({
      ...prev,
      payments: prev.payments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setError("");
    setMessage("Change successful!");
    setLoading(true);
  
    try {
      // Ensure homeAddress is always an object
      const payload = {
        ...form,
        homeAddress: {
          street: form.homeAddress?.street || "",
          city: form.homeAddress?.city || "",
          state: form.homeAddress?.state || "",
          zip: form.homeAddress?.zip || "",
        },
        // Ensure payments array has valid objects
        payments: form.payments.map((p) => ({
          cardType: p.cardType || "",
          cardNumber: p.cardNumber || "",
          expiration: p.expiration || "",
          billingAddress: p.billingAddress || "",
        })),
      };
  
      const res = await fetch("/api/user/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile update failed.");
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Name
            <input
              type="text"
              name="name"
              className="border rounded-lg p-3 w-full"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Email (cannot be changed)
            <input
              type="email"
              name="email"
              className="border rounded-lg p-3 w-full bg-gray-100"
              value={form.email}
              disabled
            />
          </label>

          <h2 className="font-semibold mt-4">Home Address</h2>
          {["street", "city", "state", "zip"].map((field) => (
            <input
              key={field}
              type="text"
              name={`homeAddress.${field}`}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border rounded-lg p-3 w-full"
              value={form.homeAddress[field] || ""}
              onChange={handleChange}
            />
          ))}

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              name="promoOptIn"
              checked={form.promoOptIn}
              onChange={handleChange}
            />
            <label>Receive promotional emails</label>
          </div>

          <h2 className="font-semibold mt-4">Payment Cards</h2>
          {form.payments.map((card, index) => (
            <div
              key={index}
              className="border p-3 rounded-lg flex flex-col gap-2 mb-2 bg-gray-50"
            >
              <input
                type="text"
                placeholder="Card Type (Visa, MasterCard)"
                className="border rounded-lg p-2"
                value={card.cardType}
                onChange={(e) => handlePaymentChange(index, "cardType", e.target.value)}
              />
              <input
                type="text"
                placeholder="Card Number"
                className="border rounded-lg p-2"
                value={card.cardNumber}
                onChange={(e) => handlePaymentChange(index, "cardNumber", e.target.value)}
              />
              <input
                type="text"
                placeholder="Expiration (MM/YY)"
                className="border rounded-lg p-2"
                value={card.expiration}
                onChange={(e) => handlePaymentChange(index, "expiration", e.target.value)}
              />
              <input
                type="text"
                placeholder="Billing Address"
                className="border rounded-lg p-2"
                value={card.billingAddress}
                onChange={(e) =>
                  handlePaymentChange(index, "billingAddress", e.target.value)
                }
              />
              {form.payments.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 text-sm mt-1 self-end"
                  onClick={() => removePayment(index)}
                >
                  Remove Card
                </button>
              )}
            </div>
          ))}

          {form.payments.length < 3 && (
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm self-start"
              onClick={addPayment}
            >
              + Add another card
            </button>
          )}

          <h2 className="font-semibold mt-4">Change Password</h2>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            className="border rounded-lg p-3"
            value={form.currentPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            className="border rounded-lg p-3"
            value={form.newPassword}
            onChange={handleChange}
          />
          
          {message && <p className="text-green-600 text-center mt-2">{message}</p>}
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
          
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-3 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
