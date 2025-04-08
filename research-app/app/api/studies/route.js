// app/api/studies/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../lib/dbconnect";
import Study from "../../models/study";

export async function POST(req) {
  try {
    await dbConnect();
    const { title, description } = await req.json();

    const newStudy = new Study({ title, description });
    const savedStudy = await newStudy.save();

    return NextResponse.json(savedStudy, { status: 201 }); // Send back the created study as JSON
  } catch (error) {
    console.error("Error creating study:", error);
    return NextResponse.json({ error: "Failed to create study" }, { status: 500 });
  }
}

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