// API route for validating promo code
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Promo from "@/models/Promo";

export const dynamic = "force-dynamic";

// GET request 
export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    // Check
    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    } // if 

    // Find promo by code
    const promo = await Promo.findOne({ 
      promoCode: code.trim().toUpperCase() 
    }); // promo
    // Check 
    if (!promo) {
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 404 }
      );
    } // if 

    // Check if promo is active
    if (!promo.isActive) {
      return NextResponse.json(
        { error: "This promo code is no longer active" },
        { status: 400 }
      );
    } // if 

    // Check if promo is within valid date range
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    if (now < startDate) {
      return NextResponse.json(
        { error: "This promo code is not yet valid" },
        { status: 400 }
      );
    } // if

    if (now > endDate) {
      return NextResponse.json(
        { error: "This promo code has expired" },
        { status: 400 }
      );
    } // check 

    // Promo code is valid - success 
    return NextResponse.json({
      message: "Promo code is valid",
      promo: {
        promoCode: promo.promoCode,
        discountPercent: promo.discountPercent
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } // try-catch
} // GET 