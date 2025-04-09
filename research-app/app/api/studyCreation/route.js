import { MongoClient } from "mongodb";
import { NextResponse } from 'next/server';

const url = process.env.MONGO_URL;
const client = new MongoClient(url);

export async function POST(req) {
  const { title, description } = await req.json();

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const newStudy = {
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  try {
    await client.connect();
    const database = client.db("studyfront");
    const studies = database.collection("studies");
    const result = await studies.insertOne(newStudy);

    return NextResponse.json({
      id: result.insertedId,
      title: newStudy.title,
      description: newStudy.description,
      createdAt: newStudy.createdAt,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed connecting to database: ", error);
    return NextResponse.json({ error: "Failed to create a study due to a database error" }, { status: 500 });
  } finally {
    await client.close();
  }
}