import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { sendEmail } from "@/lib/email";
import mongoose from "mongoose";

// POST to send booking confirmation email
export async function POST(req) {
  await connectDB();
  
  try {
    const body = await req.json();
    const { bookingId } = body;

    // Validate booking ID
    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required." },
        { status: 400 }
      );
    } // if 

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID." },
        { status: 400 }
      );
    } // if 

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    } // if 

    // Format date for display
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours %12;
      hours = hours ? hours : 12; 
      const formattedHours = String(hours);
      return `${month}/${day}/${year} at ${formattedHours}:${minutes} ${ampm}`;
    }; // formatDate 

    // Build ticket list HTML
    const ticketsHTML = booking.tickets
      .map(
        (ticket) =>
          `<li>Seat ${ticket.seat} - ${ticket.ageCategory.charAt(0).toUpperCase() + ticket.ageCategory.slice(1)}</li>`
      ) // map
      .join(""); // ticketsHTML

    // Email content
    const subject = `Booking Confirmation - ${booking.movieTitle || "Your Movie"}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #a1161a;">🎉 Booking Confirmed!</h2>
        <p>Hello ${booking.userName || "Movie Lover"},</p>
        <p>Your booking has been confirmed. Here are your details:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
          <p style="margin: 5px 0;"><strong>Movie:</strong> ${booking.movieTitle || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Showtime:</strong> ${formatDate(booking.showtime.dateTime)}</p>
          <p style="margin: 5px 0;"><strong>Showroom:</strong> ${booking.showtime.showroom}</p>
        </div>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Your Seats</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${ticketsHTML}
          </ul>
        </div>

        ${
          booking.promoCode
            ? `<div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                 <p style="margin: 0; color: #2e7d32;"><strong>✓ Promo Code Applied:</strong> ${booking.promoCode}</p>
               </div>`
            : ""
        }

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Payment Summary</h3>
          <p style="margin: 5px 0; font-size: 18px;"><strong>Total Paid:</strong> <span style="color: #a1161a; font-size: 24px;">$${booking.totalPrice.toFixed(2)}</span></p>
        </div>

        <p>Please arrive at least 15 minutes before showtime.</p>
        <p>We look forward to seeing you at CES!</p>
        <br />
        <p style="color: #666;">Best regards,<br />The CES Team</p>
      </div>
    `; // html

    // Send email to the user
    try {
      await sendEmail({
        to: booking.userEmail,
        subject: subject,
        html: html,
      });

      return NextResponse.json(
        {
          ok: true,
          message: "Confirmation email sent successfully.",
        },
        { status: 200 }
      ); // return
    } catch (emailError) {
      console.error(`Failed to send email to ${booking.userEmail}:`, emailError);
      return NextResponse.json(
        { error: "Failed to send confirmation email." },
        { status: 500 }
      );
    } // try-catch 
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send confirmation email." },
      { status: 500 }
    );
  } // try-catch 
}