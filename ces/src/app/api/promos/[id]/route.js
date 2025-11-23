import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Promo from "@/models/Promo";
import mongoose from "mongoose";

// GET - single promo by ID
export async function GET(req, { params }) {
  await connectDB();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid promo ID" }, { status: 400 });
  } // if 

  try {
    const _id = new mongoose.Types.ObjectId(id);
    const promo = await Promo.findById({_id});
    if (!promo) {
      return NextResponse.json({ error: "Promo not found" }, { status: 404 });
    } // if 

    return NextResponse.json(promo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } // try-catch
} // GET

// DELETE 
export async function DELETE(req, { params }) {
  await connectDB();
  
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid promo ID" }, { status: 400 });
  } // if 

  try {
    const _id = new mongoose.Types.ObjectId(id);
    const promo = await Promo.findByIdAndDelete(_id);
    
    if (!promo) {
      return NextResponse.json({ error: "Promo not found" }, { status: 404 });
    } // if 

    return NextResponse.json({ message: "Promo deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } // try-catch 
} // DELETE 

// PUT 
export async function PUT(req, { params }) {
  await connectDB();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid promo ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { promoCode, discountPercent, startDate, endDate } = body;

    // Validate required fields
    if (!promoCode || !discountPercent || !startDate || !endDate) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      ); // return
    } // if 

    // Validate discount range
    if (discountPercent < 1 || discountPercent > 100) {
        return NextResponse.json(
            { error: "Discount must be between 1% and 100%."}, 
            { status: 400 }
        ); // return 
    } // if 

    // Validate promo dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json(
            { error: "Invalid date format."}, 
            { status: 400 }
        ); // return 
    } // if
    if (end <= start) {
        return NextResponse.json(
            { error: "End date must be after start date."}, 
            { status: 400 }
        ); // return 
    } // if 

    // Check if editing promo code to a promo code that already exists
    const _id = new mongoose.Types.ObjectId(id);
    const existingPromo = await Promo.findOne({
        promoCode: promoCode.trim(), 
        _id: { $ne: _id } // Exclude current promo from check
    }); // existingPromo
    if (existingPromo) {
        return NextResponse.json(
            { error: "Promo code already exists."}, 
            { status: 400 }
        ); // return 
    } // if 

    const updatedPromo = await Promo.findByIdAndUpdate(
      _id,
      { promoCode: promoCode.trim(), discountPercent: Number(discountPercent), startDate: start, endDate: end },
      { new: true, runValidators: true }
    ); // updatedPromo

    if (!updatedPromo) {
      return NextResponse.json({ error: "Promo not found" }, { status: 404 });
    } // if 

    return NextResponse.json({ message: "Promo updated successfully", promo: updatedPromo }, { status: 200 });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { error: error.message }, 
                { status: 400 }
            ); // return 
        } // if 
        return NextResponse.json({ error: error.message }, { status: 500 });
    } // try-catch 
} // PUT 