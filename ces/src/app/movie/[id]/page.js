// movie/[id]/page.js: Dynamic page for displaying movie information
// Fetch movie data dynamically from our database -> display movie page for that specific movie

// Displays: poster, title, rating, description, available showtimes, trailer
// Embed trailer here or on home page

// src/app/movie/[id]/page.js


"use client";

import { useParams } from "next/navigation";
import NavBar from "@/app/components/NavBar";

export default function MovieDetails() {
  const params = useParams();
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
            <p className="font-medium">
              Showtimes: {movie.showtimes.join(", ")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
