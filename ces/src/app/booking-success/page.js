"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function BookingSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get booking info from query params
  const movie = searchParams.get("movie");
  const showtime = searchParams.get("showtime");
  const showroom = searchParams.get("showroom");
  const seats = searchParams.get("seats"); // comma-separated
  const ticketTypes = searchParams.get("ticketTypes"); // comma-separated
  const total = searchParams.get("total");
  const promoCode = searchParams.get("promoCode");

  const seatList = seats ? seats.split(",") : [];
  const ticketList = ticketTypes ? ticketTypes.split(",") : [];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900 p-6">
      <div className="max-w-2xl w-full bg-gray-50 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-green-600 text-center">
          🎉 Booking Confirmed!
        </h1>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Booking Details
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Movie:</span>
              <span className="font-semibold">{movie}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Showtime:</span>
              <span className="font-semibold">
                {new Date(showtime).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Showroom:</span>
              <span className="font-semibold">{showroom}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Seats & Tickets
          </h2>
          <ul className="space-y-2">
            {seatList.map((seat, idx) => (
              <li key={seat} className="flex justify-between">
                <span className="font-medium">Seat {seat}:</span>
                <span className="text-gray-600">{ticketList[idx]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Payment Summary
          </h2>
          <div className="space-y-2">
            {promoCode && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Promo Code Applied:</span>
                <span className="font-semibold">{promoCode}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold border-t pt-3 mt-3">
              <span>Total Paid:</span>
              <span className="text-green-600">${parseFloat(total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-800">
            📧 A confirmation email has been sent to your registered email address with your booking details.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/profile/orders")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}