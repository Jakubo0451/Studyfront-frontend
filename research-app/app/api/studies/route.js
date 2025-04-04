import { NextResponse } from "next/server";
import dbConnect from "../../lib/dbconnect";
import Study from "../../models/study";

export async function GET() {
  try {
    await dbConnect();
    const studies = await Study.find({});
    return NextResponse.json(studies, { status: 200 });
  } catch (error) {
    console.error("Error fetching studies", error);
    return NextResponse.json(
      { error: "Failed to fetch studies" },
      { status: 500 }
    );
  }
}
