// movie/[id]/page.js: Dynamic page for displaying movie information
// Fetch movie data dynamically from our database -> display movie page for that specific movie

// Displays: poster, title, rating, description, available showtimes, trailer
// Embed trailer here

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MovieDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${id}`,{ cache: "no-store" });
        const data = await res.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
        setLoading(false);
      }
    }

    if (id) fetchMovie();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  // Simple click: just go to booking page
  const handleBookingClick = (st) => {
    const movieId = id;
    const showtime = encodeURIComponent(new Date(st.dateTime).toISOString());
    const showroom = encodeURIComponent(st.showroom || "");
    router.push(`/booking?movieId=${movieId}&showtime=${showtime}&showroom=${showroom}`);
  };

function toYouTubeEmbed(url) {
  if (!url) return "";
  const m =
    url.match(/[?&]v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?&/]+)/) ||
    url.match(/youtube\.com\/shorts\/([^?&/]+)/);
  const id = m ? m[1] : "";
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">{movie.title}</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Left */}
          <div className="md:w-1/4 w-full">
            <img 
              src={movie.posterUrl} 
              alt={movie.title}
              className="w-full rounded-lg object-cover"
              onError={(e) => {e.target.src = '/placeholder-poster.jpg';}}
            />
          </div>
          {/* Info Middle */}
          <div className="md:w-3/8 w-full flex flex-col justify-start gap-4">
            <p className="font-semibold">Rating: {movie.rating}</p>
            <p className="font-medium">Genre: {movie.genre}</p>
            <p>{movie.description}</p>

            {/* Showtimes as simple buttons */}
<div className="mt-4">
  <p className="font-medium mb-2">Showtimes:</p>

  <div className="flex flex-wrap gap-2">
  {movie.showtimes?.length > 0 ? (
  movie.showtimes.map((st, index) => {
    const dt = st.dateTime ? new Date(st.dateTime) : null;
    const date = dt?.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) || "Date TBA";
    const time = dt?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) || "Time TBA";

    return (
      <button
        key={index}
        onClick={() => handleBookingClick(st)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        {`${st.showroom} – ${date} ${time}`}
      </button>
    );
  })
) : (
  <p className="text-sm text-gray-500">No showtimes available.</p>
)}

  </div>
</div>

          </div>
          {/* Trailer Right */}
          <div className="md:w-3/8 w-full h-64 md:h-96">
            <iframe
              className="w-full h-full rounded-lg"
              src={toYouTubeEmbed(movie.trailerUrl)}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
}