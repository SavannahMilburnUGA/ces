import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Movie from "../../../models/Movie";

export const dynamic = "force-dynamic";

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
} //POST 

// GET request 
export async function GET() { 
  
  await connect();
  try{
  const movies = await Movie.find().sort({ createdAT: -1}.lean());
  return NextResponse.json({ message: "Movie retreived", movies},{status:200});
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} //GET


