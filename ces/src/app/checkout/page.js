"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();

  const movieId = params.get("movieId") || "";
  const movieTitle = params.get("movieTitle") || "";
  const showtime = params.get("showtime") || "";
  const showroom = params.get("showroom") || "";
  const seats = params.get("seats")?.split(",") || [];
  const ticketTypes = params.get("ticketTypes")?.split(",") || [];
  const promoCode = params.get("promoCode") || "";

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [savedCard, setSavedCard] = useState(null);
  const [cardInfo, setCardInfo] = useState({
    cardType: "",
    cardNumber: "",
    expiration: "",
    billingAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user info and saved card
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/me");
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        if (data.payments?.length > 0) setSavedCard(data.payments[0]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }

    if (!useSavedCard && Object.values(cardInfo).some((v) => !v)) {
      setError("Please complete your payment information.");
      return;
    }

    setLoading(true);

    const payment = useSavedCard && savedCard ? savedCard : cardInfo;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          movieTitle,
          showtime,
          showroom,
          seats,
          ticketTypes,
          userEmail: email,
          userName: name,
          payment,
          promoCode: promoCode || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      // Use backend-calculated total and applied promo code
      const totalPaid = data.totalPaid || 0;
      const appliedPromo = data.booking?.promoCode || "";

      // Redirect to booking-success
      router.push(
        `/booking-success?movie=${encodeURIComponent(movieTitle)}` +
          `&showtime=${encodeURIComponent(showtime)}` +
          `&showroom=${encodeURIComponent(showroom)}` +
          `&seats=${encodeURIComponent(seats.join(","))}` +
          `&ticketTypes=${encodeURIComponent(ticketTypes.join(","))}` +
          `&total=${totalPaid.toFixed(2)}` +
          (appliedPromo ? `&promoCode=${encodeURIComponent(appliedPromo)}` : "")
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="container mx-auto p-6 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>

        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="font-semibold text-lg mb-2">Booking Details</h2>
          <p><strong>Movie:</strong> {movieTitle}</p>
          <p><strong>Showtime:</strong> {new Date(showtime).toLocaleString()}</p>
          <p><strong>Showroom:</strong> {showroom}</p>
          <p><strong>Seats:</strong> {seats.join(", ")}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">Full Name*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email*</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>

          {savedCard && (
            <div className="mb-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useSavedCard}
                  onChange={(e) => setUseSavedCard(e.target.checked)}
                />
                Use saved card ending {savedCard.cardNumber.slice(-4)}
              </label>
            </div>
          )}

          {!useSavedCard && (
            <div className="space-y-4">
              {["cardType", "cardNumber", "expiration", "billingAddress"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-medium">
                    {field === "cardType" ? "Card Type*" :
                     field === "cardNumber" ? "Card Number*" :
                     field === "expiration" ? "Expiration (MM/YY)*" :
                     "Billing Address*"}
                  </label>
                  <input
                    type="text"
                    value={cardInfo[field]}
                    onChange={(e) =>
                      setCardInfo({ ...cardInfo, [field]: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {loading ? "Processing…" : "Complete Booking"}
          </button>
        </form>
      </main>
    </div>
  );
}
