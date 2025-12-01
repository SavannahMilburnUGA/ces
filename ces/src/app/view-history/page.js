"use client";

import { useEffect, useState } from "react";

export default function PreviousPurchasesPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings/user");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!bookings.length) return <p className="text-center mt-10">No previous purchases found.</p>;

  return (
    <div className="container mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold mb-6">View Order History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Movie</th>
              <th className="py-2 px-4 border">Showtime</th>
              <th className="py-2 px-4 border">Seats</th>
              <th className="py-2 px-4 border">Tickets</th>
              <th className="py-2 px-4 border">Total Price</th>
              <th className="py-2 px-4 border">Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="text-center">
                <td className="py-2 px-4 border">{booking.movieTitle}</td>
                <td className="py-2 px-4 border">
                  {new Date(booking.showtime.dateTime).toLocaleString()} ({booking.showtime.showroom})
                </td>
                <td className="py-2 px-4 border">{booking.tickets.map(t => t.seat).join(", ")}</td>
                <td className="py-2 px-4 border">{booking.tickets.map(t => t.ageCategory).join(", ")}</td>
                <td className="py-2 px-4 border">${booking.totalPrice.toFixed(2)}</td>
                <td className="py-2 px-4 border">{new Date(booking.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
