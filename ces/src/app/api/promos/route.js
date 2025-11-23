import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Promo from "../../../models/Promo";

export const dynamic = "force-dynamic";

// POST request to /api/promos
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { promoCode, discountPercent, startDate, endDate } = body;

    // Validating all required fields on server-side
    if (!promoCode || !discountPercent || !startDate || !endDate) {
        return NextResponse.json(
            { error: "All fields are required."}, 
            { status: 400 }
        ); // return 
    } // if 

    // Validate discount range (1-100%)
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

    // Check if promo code already exists
    const existingPromo = await Promo.findOne({ promoCode: promoCode.trim() });
    if (existingPromo) {
        return NextResponse.json(
            { error: "Promo code already exists."}, 
            { status: 400 }
        ); // return 
    } // if

    // Convert String dates to Date objects
    const promoData = { 
        promoCode: promoCode.trim(), 
        discountPercent: Number(discountPercent),
        startDate: start, 
        endDate: end
    }; // promoData

    // Save promo to MongoDB
    const promo = await Promo.create(promoData);

    // Returns new promo as JSON whe successful 
    return NextResponse.json({ message: "Promo added to database", promo }, { status: 201 });
  } catch (e) {
    if (e.name === 'ValidationError') {
        return NextResponse.json(
            { error: e.message }, 
            { status: 400 }
        ); // return 
    } // if
    return NextResponse.json({ error: e.message }, { status: 400 });
  } // try-catch 
} //POST 

// GET request 
export async function GET() { 
  
  await connectDB();
  try{
  const promos = await Promo.find().sort({ createdAt: -1 });
  return NextResponse.json({ message: "Promo retreived", promos },{status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  } // try-catch
} //GET