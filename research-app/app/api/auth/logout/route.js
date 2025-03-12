import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const response = NextResponse.json(
        { message: "User logged out" },
        { status: 200 }
      );
    
      response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      });
    
      return response;
  
    } catch (error) {
    console.error("Error logging out user", error);
    return NextResponse.json({ message: "Error logging out user" }, { status: 500 });
  }
}
