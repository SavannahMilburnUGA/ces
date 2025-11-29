import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Price from "@/models/Price";
import Promo from "@/models/Promo";
import { calculateOrderTotal } from "@/lib/pricing"; 

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

    // Fetch current prices from DB
    const prices = await Price.findOne();
    // Check
    if (!prices) {
      return NextResponse.json(
        { error: "Pricing not configured. "}, 
        { status: 500 }
      ); // return
    } // if

    // Validate promo code 
    let validatedPromo = null;
    if (bookingData.promoCode) {
      const promo = await Promo.findOne({
        promoCode: bookingData.promoCode.trim()
      }); // promo 
      // Check if promo code valid
      if (promo && promo.isActive) {
        const now = new Date();
        const startDate = new Date(promo.startDate);
        const endDate = new Date(promo.endDate);

        // Only use promo code if within valid date range
        if (now >= startDate && now <= endDate) {
          validatedPromo = promo;
        } // if 
      } // if 
    } // if 

    // Transform seat & ticketType arrays into tickets
    const tickets = bookingData.seats.map((seat, i) => ({
      seat,
      ageCategory: bookingData.ticketTypes[i].toLowerCase(),
    }));

    // Calculate order total
    const ticketsForCalc = bookingData.seats.map((seat, i) => ({
      seat,
      type: bookingData.ticketTypes[i]
    })); // ticketsForCalc

    const orderTotal = calculateOrderTotal(
      ticketsForCalc, 
      prices, 
      validatedPromo?.discountPercent || 0
    ); // orderTotal 

    const newBooking = await Booking.create({
      movieId: bookingData.movieId,
      movieTitle: bookingData.movieTitle,
      showtime: {
        showroom: bookingData.showroom,
        dateTime: new Date(bookingData.showtime),
      },
      userEmail: bookingData.userEmail,
      userName: bookingData.userName,
      tickets,
      totalPrice: orderTotal.total, 
      promoCode: validatedPromo ? bookingData.promoCode : null, 
    });

    // Send confirmation email
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bookings/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: newBooking._id.toString() }),
    }).catch((err) => console.error("Failed to send confirmation email:", err));
    

    return NextResponse.json({ message: "Booking saved!", booking: newBooking, totalPaid: orderTotal.total });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}