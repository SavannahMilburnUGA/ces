// src/app/api/bookings/user/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = cookies();
    const session = cookieStore.get("userSession");
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sessionData = JSON.parse(session.value);
    if (!sessionData._id) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const user = await User.findById(sessionData._id).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const bookings = await Booking.find({ userEmail: user.email }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(bookings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
