import { NextResponse } from "next/server";

export async function POST() {
  // create response first
  const res = NextResponse.json({ message: "Logged out successfully." });

  // clear the cookie
  res.cookies.set("userSession", "", {
    path: "/",       // must match login cookie path
    maxAge: 0,       // expire immediately
    httpOnly: true,  // match login cookie
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
