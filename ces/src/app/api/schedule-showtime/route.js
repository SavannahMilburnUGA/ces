import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Movie from "@/models/Movie";

export async function POST(request) {
  await connectDB();

  const { movieId, showroom, dateTime } = await request.json();

  if (!movieId || !showroom || !dateTime) {
    return NextResponse.json(
      { message: "movieId, showroom, and dateTime are required." },
      { status: 400 }
    );
  }

  const dt = new Date(dateTime);

  // Conflict check
  const conflict = await Movie.findOne({
    showtimes: {
      $elemMatch: { showroom, dateTime: dt },
    },
  });

  if (conflict) {
    return NextResponse.json(
      { message: "This showroom is already booked at this time." },
      { status: 400 }
    );
  }

  // Add showtime
  const updated = await Movie.findByIdAndUpdate(
    movieId,
    { $push: { showtimes: { showroom, dateTime: dt } } },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json(
      { message: "Movie not found." },
      { status: 404 }
    );
  }

  const newShowtime = updated.showtimes[updated.showtimes.length - 1];
  return NextResponse.json(newShowtime, { status: 201 });


}

 // Delete showtime 
export async function DELETE(request) {
  await connectDB();

  const { movieId, showroom, dateTime } = await request.json();

  if (!movieId || !showroom || !dateTime) {
    return NextResponse.json(
      { message: "movieId, showroom, and dateTime are required." },
      { status: 400 }
    );
  }

  const dt = new Date(dateTime);

  const updated = await Movie.findByIdAndUpdate(
    movieId,
    { $pull: { showtimes: { showroom, dateTime: dt } } },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ message: "Movie not found." }, { status: 404 });
  }

  // return the new showtimes array
  return NextResponse.json(updated.showtimes, { status: 200 });
}


