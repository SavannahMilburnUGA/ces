import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Movie from "@/models/Movie";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  await connectDB();

  const id = params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
  }

  try {
    const movie = await Movie.findById(id);
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
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    } // if 

    return NextResponse.json({ message: "Movie deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } // try-catch 
} // DELETE 

// Put for edit 
export async function PUT(req, { params }) {
  await connectDB();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { title, posterUrl, rating, description, showDate, trailerUrl, genre } = body;

    // Validate required fields
    if (!title || !posterUrl || !description || !showDate || !trailerUrl || !genre) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, posterUrl, rating, description, showDate, trailerUrl, genre },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Movie updated successfully", movie: updatedMovie }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} // PUT 