import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/dbconnect";
import User from "../../../models/user";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({ message: "User logged in" }, { status: 200 });

    // Set HTTP-only cookie for authentication
    response.cookies.set("token", token, {
      httpOnly: true,  // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 1 day in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error logging in user", error);
    return NextResponse.json({ message: "Error logging in user" }, { status: 500 });
  }
}
