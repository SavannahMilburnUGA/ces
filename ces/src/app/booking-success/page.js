"use client";

import { useSearchParams } from "next/navigation";

export default function BookingSuccess() {
  const searchParams = useSearchParams();

  // Get booking info from query params
  const movie = searchParams.get("movie");
  const showtime = searchParams.get("showtime");
  const showroom = searchParams.get("showroom");
  const seats = searchParams.get("seats"); // comma-separated
  const ticketTypes = searchParams.get("ticketTypes"); // comma-separated

  const seatList = seats ? seats.split(",") : [];
  const ticketList = ticketTypes ? ticketTypes.split(",") : [];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Booking Confirmed!</h1>
      <p className="mb-2">Movie: <strong>{movie}</strong></p>
      <p className="mb-2">
        Showtime: <strong>{new Date(showtime).toLocaleString()}</strong>
      </p>
      <p className="mb-2">Showroom: <strong>{showroom}</strong></p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Seats & Ticket Types:</h2>
        <ul className="list-disc list-inside">
          {seatList.map((seat, idx) => (
            <li key={seat}>
              {seat} - {ticketList[idx]}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-gray-600">
        Please check your email for further details.
      </p>
    </div>
  );
}