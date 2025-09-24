// src/app/booking/page.js
"use client";

import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { useSearchParams, useRouter } from "next/navigation";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get movie and showtime from query params
  const movieTitle = searchParams.get("movie") || "Unknown Movie";
  const showtime = searchParams.get("time") || "Time TBA";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tickets: 1,
    ageCategory: "Adult",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Booking confirmed for ${movieTitle} at ${showtime}!\nTickets: ${formData.tickets}, Category: ${formData.ageCategory}\n(Front-end UI only)`
    );
    router.push("/"); // Return to home after confirmation
  };

  return (
    <div className="min-h-screen bg-[#001f4d] text-white">
      <Navbar />

      <main className="container mx-auto p-6 flex flex-col gap-8">
        <h1 className="text-3xl font-bold mb-4">Book Your Ticket</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-8">
          {/* Movie & Showtime Info */}
          <div className="md:w-1/3">
            <h2 className="text-2xl font-semibold mb-2">{movieTitle}</h2>
            <p className="text-lg">
              Showtime: <span className="font-bold">{showtime}</span>
            </p>
          </div>

          {/* Booking Form */}
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Phone (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Number of Tickets</label>
                <input
                  type="number"
                  name="tickets"
                  min="1"
                  max="10"
                  value={formData.tickets}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Age Category</label>
                <select
                  name="ageCategory"
                  value={formData.ageCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Child">Child</option>
                  <option value="Adult">Adult</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-red-600 px-6 py-3 rounded font-semibold hover:bg-red-700 transition"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
