import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/dbconnect";
import User from "../../../../models/user";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.badRequest(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.notFound(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.unauthorized(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return NextResponse.ok({ message: "User logged in", token }, { status: 200 });
  } catch (error) {
    console.error("Error logging in user", error);
    return NextResponse.error({ message: "Error logging in user" }, { status: 500 });
  }
}
