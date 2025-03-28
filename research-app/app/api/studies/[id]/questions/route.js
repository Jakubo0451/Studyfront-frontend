import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const url = process.env.MONGO_URL;
const client = new MongoClient(url);

// Add a new question to a study
export async function POST(req, { params }) {
  try {
    await client.connect();
    const db = client.db("studyfront");
    const studies = db.collection("studies");

    const { type, data } = await req.json();
    const studyId = params.req;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Type and data are required" },
        { status: 400 }
      );
    }

    const questions = {
      _id: new ObjectId(),
      type,
      data,
    };

    const updateResult = await studies.updateOne(
      { _id: new ObjectId(studyId) },
      { $push: { questions: question } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ error: "Study not found" }, { status: 404 });
    }

    const updatedStudy = await studies.findOne({ _id: new ObjectId(studyId) });
    return NextResponse.json(updatedStudy, { status: 201 });
  } catch (error) {
    console.error("Error adding a question", error);
    return NextResponse.json(
      { error: "Failed to add the question" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// Update a question in a study
export async function PUT(req, { params }) {
  try {
    await client.connect();
    const db = client.db("studyfront");
    const studies = db.collection("studies");

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

    const updateResult = await studies.updateOne(
      { _id: new ObjectId(studyId) },
      { $push: { questions: question } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    const updatedStudy = await studies.findOne({ _id: new Object(studyId) });
    return NextResponse.json(updatedStudy, { status: 200 });
  } catch (error) {
    console.error("Failed to update the question", error);
    return NextResponse.json(
      { error: "Failed to update the question" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// Delete a question from a study
export async function DELETE(req, { params }) {
  try {
    await client.connect();
    const db = client.db("studyfront");
    const studies = db.collection("studies");

    const studyId = params.id;
    const questionId = params.questionId;

    const updateResult = await studies.updateOne(
      { _id: new ObjectId(studyId) },
      { $pull: { questions: { _id: new ObjectId(questionId) } } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    const updatedStudy = await studies.findOne({ _id: new ObjectId(studyId) });
    return NextResposne.json(updatedStudy, { status: 204 });
  } catch (error) {
    console.error("Error deleting a question", error);
    return NextResponse.json(
      { error: "Failed to delete the question " },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// Get a specific question
export async function GET(req, { params }) {
  try {
    await client.connect();
    const db = client.db("studyfront");
    const studies = db.collection("studies");
    const studyId = params.id;
    const questionId = params.questionId;

    const study = await studies.findOne({
      _id: new ObjectId(studyId),
      question_id: new ObjectId(questionId),
    });

    if (!study) {
        return NextResponse.json({ error: "Study or question not found"}, {status: 404})
    }

    const question = study.questions.find((q)=> q._id.toString() === questionId)

    if (!question) {
        return NextResponse.json({ error: "Question not found "}, {status: 404})
    }

    return NextResponse.json(question, {status: 200})
  } catch (error) {
    console.error("Error getting the question", error)
    return NextResponse.json({ error: "Failed to get question"}, {status: 500})
  } finally{
    await client.close()
  }
}
