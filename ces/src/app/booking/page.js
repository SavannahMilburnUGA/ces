"use client";

import { useSearchParams } from "next/navigation";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const movie = searchParams.get("movie");      // safely get query param
  const showtime = searchParams.get("showtime"); // safely get query param

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Booking Page (Prototype)</h1>
        <p className="mb-2">Movie: <span className="font-semibold">{movie}</span></p>
        <p className="mb-4">Showtime: <span className="font-semibold">{showtime}</span></p>

        <form className="flex flex-col gap-4 max-w-md">
          <label>
            Name:
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-3 py-2 border rounded"
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded"
            />
          </label>

          <label>
            Number of Tickets:
            <input
              type="number"
              min="1"
              defaultValue={1}
              className="w-full px-3 py-2 border rounded"
            />
          </label>

          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </main>
    </div>
  );
}
