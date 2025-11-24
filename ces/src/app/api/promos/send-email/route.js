// API route for sending promos to registered users who opted in to promos (must be active & not suspended)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Promo from "@/models/Promo";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import mongoose from "mongoose";

// POST to send email to all registered and subscribed users
export async function POST(req) {
    await connectDB();
    try {
        const body = await req.json();
        const { promoId } = body;

        // Validate promo ID
        if (!promoId) {
            return NextResponse.json(
                { error: "Promo ID is required." }, 
                { status: 400 }
            ); // return
        } // if
        if (!mongoose.Types.ObjectId.isValid(promoId)) {
            return NextResponse.json(
                { error: "Invalid promo ID." }, 
                { status: 400 }
            ); // return
        } // if 

        // Find the promo
        const promo = await Promo.findById(promoId);
        if (!promo) {
            return NextResponse.json(
                { error: "Promo not found." }, 
                { status: 404 }
            ); // return
        } // if 

        // Find all users who opted in for promotions 
        const subscribedUsers = await User.find({ 
            promoOptIn: true, 
            status: "Active", 
            suspended: false 
        }); // subscribedUsers
        
        if (subscribedUsers.length === 0) {
            return NextResponse.json(
                { error: "No subscribed users found.", count: 0 }, 
                { status: 200 }
            ); // return
        } // if 

        // Format date for display
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            const year = date.getUTCFullYear();
            return `${month}/${day}/${year}`;
        }; // formatDate
        
        // Email content 
        const subject = `Special Promotion: ${promo.promoCode} - ${promo.discountPercent}% Off!`;
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #a1161a;">Special Promotion Just for You!</h2>
                    <p>Hello!</p>
                    <p>We're excited to offer you an exclusive promotion:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Promo Code:</strong> 
                            <span style="color: #a1161a; font-size: 20px; font-weight: bold;">${promo.promoCode}</span>
                        </p>
                        <p style="margin: 5px 0;"><strong>Discount:</strong> ${promo.discountPercent}% off your purchase</p>
                        <p style="margin: 5px 0;"><strong>Valid:</strong> ${formatDate(promo.startDate)} - ${formatDate(promo.endDate)}</p>
                    </div>
                    <p>Use this code at checkout to save on your next booking at CES!</p>
                    <p>Thank you for being a valued customer.</p>
                    <br /> 
                    <p> CES Team </p>
            </div>`;
            
        // Send email to each subscribed valid user
        let successCount = 0;
        let failCount = 0;
        for (const user of subscribedUsers) {
            try {
                await sendEmail({
                    to: user.email,
                    subject: subject, 
                    html: html, 
                });
                successCount++;
            } catch (err) {
                console.error(`Failed to send email to ${user.email}: `, err);
                failCount++;
            } // try-catch
        } // for 

        // Update promo's sentCount & lastSentAt
        await Promo.findByIdAndUpdate(promoId, {
            $inc: { sentCount: 1 }, 
            lastSentAt: new Date(), 
        }); 

        return NextResponse.json(
        { 
            ok: true, 
            message: "Promo email sent successfully.", 
            successCount: successCount, 
            failCount: failCount, 
            totalSubscribed: subscribedUsers.length  // Changed name for clarity
            },
            { status: 200 }
        );
    } catch (error)
    {
        console.error("Error sending promo email:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send promo email. "}, 
            { status: 500 }
        ); // return
    } // try-catch
} // POST 