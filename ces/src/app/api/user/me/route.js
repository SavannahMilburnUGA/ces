// app/api/user/me/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    // Get cookie
    const cookie = req.cookies.get("userSession")?.value;
    if (!cookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = JSON.parse(cookie);
    if (!session._id) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Fetch full user from DB
    const user = await User.findById(session._id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (omit passwordHash)
    const { passwordHash, confirmationToken, confirmationCodeHash, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (err) {
    console.error("Fetch user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
