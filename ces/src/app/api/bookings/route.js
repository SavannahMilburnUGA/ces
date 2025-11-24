import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const bookingData = await req.json();

    console.log("Booking received:", bookingData);

    // TODO: Save to DB here

    return NextResponse.json({ message: "Booking saved!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
