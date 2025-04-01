// research-app/app/api/studies/[id]/questions/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "../../../lib/dbconnect";
import Study from "../../../models/study";

// Add a new question to a study
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { type, data } = await req.json();
    const studyId = params.id;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Type and data are required" },
        { status: 400 }
      );
    }

    const question = {
      _id: new ObjectId(),
      type,
      data,
    };

    const updatedStudy = await Study.findByIdAndUpdate(
      studyId,
      { $push: { questions: question } },
      { new: true } // Return the updated document
    );

    if (!updatedStudy) {
      return NextResponse.json({ error: "Study not found" }, { status: 404 });
    }

    return NextResponse.json(updatedStudy, { status: 201 });
  } catch (error) {
    console.error("Error adding a question", error);
    return NextResponse.json(
      { error: "Failed to add the question" },
      { status: 500 }
    );
  }
}

// Update a question in a study
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { data } = await req.json();
    const studyId = params.id;
    const questionId = params.questionId;

    const updatedStudy = await Study.findOneAndUpdate(
      { _id: studyId, "questions._id": new ObjectId(questionId) },
      { $set: { "questions.$.data": data } },
      { new: true }
    );

    if (!updatedStudy) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(updatedStudy, { status: 200 });
  } catch (error) {
    console.error("Failed to update the question", error);
    return NextResponse.json(
      { error: "Failed to update the question" },
      { status: 500 }
    );
  }
}

// Delete a question from a study
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const studyId = params.id;
    const questionId = params.questionId;

    const updatedStudy = await Study.findByIdAndUpdate(
      studyId,
      { $pull: { questions: { _id: new ObjectId(questionId) } } },
      { new: true }
    );

    if (!updatedStudy) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(updatedStudy, { status: 204 });
  } catch (error) {
    console.error("Error deleting a question", error);
    return NextResponse.json(
      { error: "Failed to delete the question " },
      { status: 500 }
    );
  }
}

// Get a specific question
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const studyId = params.id;
    const questionId = params.questionId;

    const study = await Study.findOne({
      _id: studyId,
      "questions._id": new ObjectId(questionId),
    });

    if (!study) {
      return NextResponse.json(
        { error: "Study or question not found" },
        { status: 404 }
      );
    }

    const question = study.questions.find(
      (q) => q._id.toString() === questionId
    );

    if (!question) {
      return NextResponse.json({ error: "Question not found " }, { status: 404 });
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error("Error getting the question", error);
    return NextResponse.json({ error: "Failed to get question" }, { status: 500 });
  }
}