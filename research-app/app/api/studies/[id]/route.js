// app/api/studies/[id]/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "../../../lib/dbconnect";
import Study from "../../../models/study";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id: studyId } = await params;

    if (!ObjectId.isValid(studyId)) {
      return NextResponse.json({ error: "Invalid study ID" }, { status: 400 });
    }

    const study = await Study.findById(studyId);

    if (!study) {
      return NextResponse.json({ error: "Study not found" }, { status: 404 });
    }

    return NextResponse.json(study, { status: 200 });
  } catch (error) {
    console.error("Failed fetching study:", error);
    return NextResponse.json({ error: "Failed to fetch study" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id: studyId } = await params;

    if (!ObjectId.isValid(studyId)) {
      return NextResponse.json({ error: "Invalid study ID" }, { status: 400 });
    }

    const deletedStudy = await Study.findByIdAndDelete(studyId);

    if (!deletedStudy) {
      return NextResponse.json({ error: "Study not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Study deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting study:", error);
    return NextResponse.json({ error: "Failed to delete study" }, { status: 500 });
  }
}