"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movie");
  const showtime = searchParams.get("showtime"); // safely get query param

  const [movie, setMovie] = useState(null);
  const [numTickets, setNumTickets] = useState(1);
  const [ticketAges, setTicketAges] = useState([0]); // array of ages
  const [selectedSeats, setSelectedSeats] = useState([]); // array of seat numbers
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");

   // Fetch movie info from API
   useEffect(() => {
    if (!movieId) return;

    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMovie();
  }, [movieId]);

  //handle number of tickets
  const handleNumTicketsChange = (value) => {
    const count = parseInt(value) || 1;
    setNumTickets(count);

    // update ticketAges array
    const newAges = [...ticketAges];
    while (newAges.length < count) newAges.push(0);
    while (newAges.length > count) newAges.pop();
    setTicketAges(newAges);
  };

  // Handle ticket age change
  const handleAgeChange = (index, value) => {
    const newAges = [...ticketAges];
    newAges[index] = parseInt(value) || 0;
    setTicketAges(newAges);
  };

  // Mock seat selection for now
  const handleSeatToggle = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < numTickets) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      setError(`You can only select ${numTickets} seat(s).`);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (ticketAges.some((age) => age <= 0)) {
      setError("All tickets must have valid ages.");
      return;
    }

    if (selectedSeats.length !== numTickets) {
      setError("Please select seats for all tickets.");
      return;
    }

    //log to console for now
    console.log({
      movie: movie?.title,
      showtime,
      numTickets,
      ticketAges,
      selectedSeats,
      promoCode,
    });

    alert("Booking submitted! Check console for data.");
  };

  if (!movieId) return <div>No movie selected.</div>;
  if (!movie) return <div>Loading movie info...</div>;

   // Safe poster and trailer URLs
   const posterUrl = movie.posterUrl && movie.posterUrl !== "" ? movie.posterUrl : "/placeholder-poster.jpg";
   const toYouTubeEmbed = (url) => {
     if (!url) return null;
     const match =
       url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&/]+)/);
     const id = match ? match[1] : null;
     return id ? `https://www.youtube.com/embed/${id}` : null;
   };
   const embedUrl = toYouTubeEmbed(movie.trailerUrl);



  // Mock seat layout: 5x5 grid
  const rows = 5;
  const cols = 5;
  const seatNumbers = Array.from({ length: rows * cols }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Poster */}
          <div className="md:w-1/4 w-full">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full rounded-lg object-cover"
              onError={(e) => (e.target.src = "/placeholder-poster.jpg")}
            />
          </div>

          {/* Info */}
          <div className="md:w-3/4 w-full flex flex-col gap-2">
            <p className="font-semibold">Rating: {movie.rating}</p>
            <p className="font-medium">Genre: {movie.genre}</p>
            <p>{movie.description}</p>

            <p className="mt-4 font-medium">Showtime:</p>
            <p>{showtime}</p>
          </div>
        </div>

        <form className="flex flex-col gap-4 max-w-md" onSubmit={handleSubmit}>
          <label>
            Number of Tickets:
            <input
              type="number"
              min="1"
              value={numTickets}
              onChange={(e) => handleNumTicketsChange(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </label>

          {/* Ticket ages */}
          {ticketAges.map((age, idx) => (
            <label key={idx}>
              Age for ticket {idx + 1}:
              <input
                type="number"
                min="1"
                value={age}
                onChange={(e) => handleAgeChange(idx, e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </label>
          ))}

          {/* Seat selection */}
          <div>
            <p className="font-medium mb-2">Select Seats:</p>
            <div className="grid grid-cols-5 gap-2">
              {seatNumbers.map((seat) => (
                <button
                  key={seat}
                  type="button"
                  className={`px-3 py-2 rounded ${
                    selectedSeats.includes(seat)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleSeatToggle(seat)}
                >
                  {seat}
                </button>
              ))}
            </div>
          </div>

          {/* Promo code */}
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
