"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movieId");
  const showtime = searchParams.get("showtime");
  const showroom = searchParams.get("showroom");

  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");

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

  const posterUrl = movie?.posterUrl || "/placeholder-poster.jpg";

  const toYouTubeEmbed = (url) => {
    if (!url) return null;
    const match =
      url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&/]+)/);
    const id = match ? match[1] : null;
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };
  const embedUrl = toYouTubeEmbed(movie?.trailerUrl);

  // Seat grid
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
      setTicketTypes([...ticketTypes, "Adult"]); // default type
    }
  };

  const handleTicketTypeChange = (index, type) => {
    const newTypes = [...ticketTypes];
    newTypes[index] = type;
    setTicketTypes(newTypes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }

    if (ticketTypes.length !== selectedSeats.length) {
      setError("Please select ticket type for all seats.");
      return;
    }

    console.log({
      movie: movie?.title,
      showtime,
      showroom,
      seats: selectedSeats,
      ticketTypes,
      promoCode,
    });

    alert("Booking submitted! Please check your email for details.");
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
              {seatNumbers.map((seat) => (
                <button
                  key={seat}
                  type="button"
                  className={`px-3 py-2 rounded ${
                    selectedSeats.includes(seat)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handleSeatToggle(seat)}
                >
                  {seat}
                </button>
              ))}
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
                    onChange={(e) => handleTicketTypeChange(idx, e.target.value)}
                    className="ml-2 px-2 py-1 rounded border"
                  >
                    <option>Adult</option>
                    <option>Child</option>
                    <option>Senior</option>
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

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Confirm Booking
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