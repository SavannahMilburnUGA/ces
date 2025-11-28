"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { calculateOrderTotal } from "@/lib/pricing";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const movieId = searchParams.get("movieId");
  const showtime = searchParams.get("showtime");
  const showroom = searchParams.get("showroom");

  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [prices, setPrices] = useState(null);

  // Fetch movie info
  useEffect(() => {
    if (!movieId) return;
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie info.");
      }
    }
    fetchMovie();
  }, [movieId]);

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/me");
        if (!res.ok) return setUser(null);
        const data = await res.json();
        setUser(data || null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // Fetch booked seats
  useEffect(() => {
    if (!movieId || !showtime || !showroom) return;

    async function fetchBookedSeats() {
      try {
        const res = await fetch(
          `/api/bookings?movieId=${movieId}&showtime=${encodeURIComponent(
            showtime
          )}&showroom=${showroom}`
        );
        const data = await res.json();
        if (data?.bookedSeats) setBookedSeats(data.bookedSeats);
      } catch (err) {
        console.error("Failed to fetch booked seats:", err);
      }
    }
    fetchBookedSeats();
  }, [movieId, showtime, showroom]);

  // Fetch prices
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        const data = await res.json();
        // Check
        if (data?.prices) {
          setPrices(data.prices);
        } // if 
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      } // try-catch
    } // fetchPrices
    fetchPrices();
  }, []); // useEffect for prices

  const posterUrl = movie?.posterUrl || "/placeholder-poster.jpg";

  const toYouTubeEmbed = (url) => {
    if (!url) return null;
    const match =
      url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&/]+)/);
    const id = match ? match[1] : null;
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };
  const embedUrl = toYouTubeEmbed(movie?.trailerUrl);

  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 7;
  const seatNumbers = rows.flatMap((row) =>
    Array.from({ length: seatsPerRow }, (_, i) => `${row}${i + 1}`)
  );

  const handleSeatToggle = (seat) => {
    setError("");
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      setTicketTypes((prev) => prev.slice(0, selectedSeats.length - 1));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      setTicketTypes([...ticketTypes, "Adult"]);
    }
  };

  const handleTicketTypeChange = (index, type) => {
    const newTypes = [...ticketTypes];
    newTypes[index] = type;
    setTicketTypes(newTypes);
  };

  // Calculate order total
  const orderTotal = prices && selectedSeats.length > 0 ? calculateOrderTotal(
    selectedSeats.map((seat, idx) => ({
      type: ticketTypes[idx], 
      seat
    })), 
    prices, 
    0 // No promo for now 
  ) : null; // orderTotal

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to submit a booking.");
      return;
    }
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }
    if (ticketTypes.length !== selectedSeats.length) {
      setError("Please select ticket type for all seats.");
      return;
    }

    const bookingData = {
      movieId,
      movieTitle: movie?.title,
      showtime,
      showroom,
      seats: selectedSeats,
      ticketTypes,
      promoCode,
      userEmail: user.email,
      userName: user.name,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Booking failed");
      }

      // Redirect to success page
      router.push(
        `/booking-success?movie=${encodeURIComponent(
          movie.title
        )}&showtime=${encodeURIComponent(
          showtime
        )}&showroom=${encodeURIComponent(
          showroom
        )}&seats=${encodeURIComponent(
          selectedSeats.join(",")
        )}&ticketTypes=${encodeURIComponent(ticketTypes.join(","))}`
      );
    } catch (err) {
      console.error("Booking failed:", err);
      setError("Failed to submit booking. Please try again.");
    }
  };

  if (!movieId) return <div>No movie selected.</div>;
  if (!movie) return <div>Loading movie info...</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/4 w-full">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full rounded-lg object-cover"
            />
          </div>
          <div className="md:w-3/4 w-full flex flex-col gap-2">
            <p className="font-semibold">Rating: {movie.rating}</p>
            <p className="font-medium">Genre: {movie.genre}</p>
            <p>{movie.description}</p>
            <p className="mt-4 font-medium">Showtime:</p>
            <p>
              {showroom} – {new Date(showtime).toLocaleString()}
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-4 max-w-md" onSubmit={handleSubmit}>
          <div>
            <p className="font-medium mb-2">Select Seats:</p>
            <div className="grid grid-cols-7 gap-2">
              {seatNumbers.map((seat) => {
                const isBooked = bookedSeats.includes(seat);
                return (
                  <button
                    key={seat}
                    type="button"
                    disabled={isBooked}
                    className={`px-3 py-2 rounded ${
                      selectedSeats.includes(seat)
                        ? "bg-green-600 text-white"
                        : isBooked
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => handleSeatToggle(seat)}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div>
              <p className="font-medium mt-4 mb-2">Select Ticket Types:</p>
              {selectedSeats.map((seat, idx) => (
                <label key={seat} className="block mb-2">
                  {seat}:
                  <select
                    value={ticketTypes[idx]}
                    onChange={(e) =>
                      handleTicketTypeChange(idx, e.target.value)
                    }
                    className="ml-2 px-2 py-1 rounded border"
                  >
                    <option value="Adult">Adult {prices ? `($${prices.ticketPrices.Adult.toFixed(2)})` : ''}</option>
                    <option value="Child">Child {prices ? `($${prices.ticketPrices.Child.toFixed(2)})` : ''}</option>
                    <option value="Senior">Senior {prices ? `($${prices.ticketPrices.Senior.toFixed(2)})` : ''}</option>
                  </select>
                </label>
              ))}
            </div>
          )}

          <label>
            Promo Code (optional):
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border rounded"
            />
          </label>

          {orderTotal && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold text-lg mb-2">Order Summary</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${orderTotal.ticketSum.toFixed(2)}</span>
                </div>
                {orderTotal.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${orderTotal.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Booking Fee:</span>
                  <span>${orderTotal.bookingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({(prices.taxRate * 100).toFixed(0)}%):</span>
                  <span>${orderTotal.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>${orderTotal.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {!user && (
            <p className="text-yellow-600 text-sm mb-2">
              Please log in to book tickets.
            </p>
          )}

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={!user}
            className={`px-4 py-2 rounded text-white transition ${
              user
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {user ? "Confirm Booking" : "Log in to book"}
          </button>
        </form>

        {embedUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Trailer</h2>
            <iframe
              className="w-full h-64 md:h-96 rounded-lg"
              src={embedUrl}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </main>
    </div>
  );
}