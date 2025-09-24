import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Movie from "../../../models/Movie";


// POST request to /api/movies
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();

    if (typeof body.showDate === "string") {
      body.showDate = new Date(body.showDate);
    }

    // save movie to mongodb 
    const movie = await Movie.create(body);

    // returns new movie as JSON whe successful 
    return NextResponse.json({ message: "Movie added to database", movie}, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


