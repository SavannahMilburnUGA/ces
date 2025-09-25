// movie/[id]/page.js: Dynamic page for displaying movie information
// Fetch movie data dynamically from our database -> display movie page for that specific movie

// Displays: poster, title, rating, description, available showtimes, trailer
// Embed trailer here or on home page

// src/app/movie/[id]/page.js

"use client";

import { useParams, useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";

export default function MovieDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${id}`);
        const data = await res.json();
        setMovie(data.movie);
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
/*
export default function MovieDetails() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // Dummy movie data for prototype
  const movie = {
    title: "Avengers: Endgame",
    posterUrl: "/placeholder-poster.jpg",
    rating: "PG-13",
    genre: "Action",
    description:
      "After the devastating events of Avengers: Infinity War, the universe is in ruins...",
    showtimes: ["2:00 PM", "5:00 PM", "8:00 PM"],
    trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c",
  };
*/
  // Simple click: just go to booking page
  const handleBookingClick = () => {
    router.push(`/booking`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavBar />
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">{movie.title}</h1>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Trailer Left */}
          <div className="md:w-1/2 w-full h-64 md:h-96">
            <iframe
              className="w-full h-full rounded-lg"
              src={movie.trailerUrl}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Info/Text Right */}
          <div className="md:w-1/2 w-full flex flex-col justify-start gap-4">
            <p className="font-semibold">Rating: {movie.rating}</p>
            <p className="font-medium">Genre: {movie.genre}</p>
            <p>{movie.description}</p>

            {/* Showtimes as simple buttons */}
            <div className="mt-4">
              <p className="font-medium mb-2">Showtimes:</p>
              <div className="flex flex-wrap gap-2">
                {movie.showtimes.map((time, index) => (
                  <button
                    key={index}
                    onClick={handleBookingClick} // now all buttons just go to /booking
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}