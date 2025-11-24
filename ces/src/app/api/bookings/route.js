import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");
    const showtime = searchParams.get("showtime");
    const showroom = searchParams.get("showroom");

    if (!movieId || !showtime || !showroom) {
      return NextResponse.json({ bookedSeats: [] });
    }

    const bookings = await Booking.find({
      movieId,
      "showtime.showroom": showroom,
      "showtime.dateTime": new Date(showtime),
    }).lean();

    const bookedSeats = bookings.flatMap((b) => b.tickets.map((t) => t.seat));

    return NextResponse.json({ bookedSeats });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ bookedSeats: [] });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const bookingData = await req.json();

    // Transform seat & ticketType arrays into tickets
    const tickets = bookingData.seats.map((seat, i) => ({
      seat,
      ageCategory: bookingData.ticketTypes[i].toLowerCase(),
      age: 30, // placeholder or calculated from user
    }));

    const newBooking = await Booking.create({
      movieId: bookingData.movieId,
      showtime: {
        showroom: bookingData.showroom,
        dateTime: new Date(bookingData.showtime),
      },
      userEmail: bookingData.userEmail,
      userName: bookingData.userName,
      tickets,
      totalPrice: tickets.length * 10, // simple pricing example
      promoCode: bookingData.promoCode || null,
    });

    return NextResponse.json({ message: "Booking saved!", booking: newBooking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
