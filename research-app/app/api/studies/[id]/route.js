// research-app/app/api/studies/[id]/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "../../../lib/dbconnect"; // Import your dbConnect function
import Study from "../../../models/study"; // Import your Study model

export async function GET(req, { params }) {
  try {
    await dbConnect(); // Connect to the database
    const studyId = params.id;

    if (!ObjectId.isValid(studyId)) {
      return NextResponse.json({ error: "Invalid study ID" }, { status: 400 });
    }

    const study = await Study.findById(studyId); // Use the Study model's findById

    if (!study) {
      return NextResponse.json({ error: "Study not found" }, { status: 404 }); // Corrected status code
    }

    return NextResponse.json(study, { status: 200 });
  } catch (error) {
    console.error("Failed fetching study:", error); // Added console.error
    return NextResponse.json({ error: "Failed to fetch study" }, { status: 500 });
  }
}