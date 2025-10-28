import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, password } = await req.json();
    // Adding admin login ? - commented out for now - change above to below ? 
    // const { email, password, isAdmin } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Account not found. Please sign up." },
        { status: 404 }
      );
    }

    // Check account status
    if (user.status === "Inactive") {
      return NextResponse.json(
        { error: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    // handle suspended users if schema includes that
    if (user.suspended === true) {
      return NextResponse.json(
        { error: "This account has been suspended." },
        { status: 403 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    // Adding admin login ? - commented out for now
    // // Verify admin access
    // if (isAdmin) {
    //   if (user.role !== "admin") {
    //     return(NextResponse.json(
    //       { error: "Unauthorized: Admin access required." }, 
    //       { status: 403 }
    //     ); // return 
    //   } // if
    // } // if

    // Success: login
    // redirect users based on role (if you add roles later)
    return NextResponse.json({
      message: "Login successful.",
      user: {
        name: user.name,
        email: user.email,
        status: user.status,
        // role: user.role, // For admin logic ?
        customerId: user.customerId || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
