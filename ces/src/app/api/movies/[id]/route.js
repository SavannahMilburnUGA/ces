import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Movie from "@/models/Movie";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  await connectDB();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
  }

  try {
    const _id = new mongoose.Types.ObjectId(id);
    const movie = await Movie.findById({_id});
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete
export async function DELETE(req, { params }) {
  await connectDB();
  
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
  } // if 

  try {
    const _id = new mongoose.Types.ObjectId(id);
    const movie = await Movie.findByIdAndDelete(_id);
    
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    } // if 

    return NextResponse.json({ message: "Movie deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } // try-catch 
} // DELETE 