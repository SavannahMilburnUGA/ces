// API route for handling prices - if Admin want to change prices
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Price from "../../../models/Price";

export const dynamic = "force-dynamic";

// GET request to /api/prices
export async function GET() { 
  
  await connectDB();
  try{
    // Only one document
    const prices = await Price.findOne();
    // Check
    if (!prices) {
        return NextResponse.json({ error: "Prices not configured. "}, { status: 404 });
    } // if 
    // Success
    return NextResponse.json({ message: "Prices retrieved:", prices }, { status: 200 }); 
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  } // try-catch
} //GET

// PUT request to /api/prices
export async function PUT(req) {
  await connectDB();
  
  try {
    const body = await req.json();
    const { ticketPrices, bookingFee, taxRate } = body;

    // Validate all required fields on server-side
    if (!ticketPrices?.Adult || !ticketPrices?.Child || !ticketPrices?.Senior || bookingFee === undefined || taxRate === undefined) {
        return NextResponse.json(
            { error: "All price fields are required." },
            { status: 400 }
        );
    } // if 

    // Validate all prices are non-negative
    if (ticketPrices.Adult < 0 || ticketPrices.Child < 0 || ticketPrices.Senior < 0 || bookingFee < 0 || taxRate < 0) {
      return NextResponse.json(
        { error: "Prices cannot be negative." },
        { status: 400 }
      );
    } // of 

    // Validate tax rate is between 0 and 1 
    if (taxRate > 1) {
      return NextResponse.json(
        { error: "Tax rate must be between 0 and 1 (e.g., 0.07 for 7%)." },
        { status: 400 }
      );
    } // if 

    // Find one price document
    let prices = await Price.findOne();
    // Check
    if (!prices) {
      prices = await Price.create({
        ticketPrices: {Adult: Number(ticketPrices.Adult), Child: Number(ticketPrices.Child), Senior: Number(ticketPrices.Senior)},
        bookingFee: Number(bookingFee),
        taxRate: Number(taxRate)
      }); // prices
      return NextResponse.json({ message: "Prices created successfully", prices }, { status: 201 });
    } else {
      // Update existing prices
      prices.ticketPrices.Adult = Number(ticketPrices.Adult);
      prices.ticketPrices.Child = Number(ticketPrices.Child);
      prices.ticketPrices.Senior = Number(ticketPrices.Senior);
      prices.bookingFee = Number(bookingFee);
      prices.taxRate = Number(taxRate);
      await prices.save();
      return NextResponse.json({ message: "Prices updated successfully", prices }, { status: 200 });
    } // if-else

  } catch (e) {
    if (e.name === 'ValidationError') {
      return NextResponse.json({ error: e.message }, { status: 400 });
    } // if 
    return NextResponse.json({ error: e.message }, { status: 400 });
  } // try-catch
} // PUT 