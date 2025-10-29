import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Account not found. Please sign up." }, { status: 404 });
    }

    if (user.status === "Inactive") {
      return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
    }

    if (user.suspended === true) {
      return NextResponse.json({ error: "This account has been suspended." }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    // ✅ Create response with cookie
    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        name: user.name,
        email: user.email,
        status: user.status,
        customerId: user.customerId || null,
      },
    });

    response.cookies.set(
      "userSession",
      JSON.stringify({ name: user.name, email: user.email }),
      {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 30, // 30 minutes
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }
    );

    return response; // ✅ return this response so cookie is sent
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
