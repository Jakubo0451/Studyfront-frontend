import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const url = process.env.MONGO_URL;
const client = new MongoLClient(url);

export async function GET(req, { params }) {
    try {
        await client.connect();
        const db = client.db('studyfront')
        const studies = db.collection("studies")

        const studyId = params.id;

        if (!ObjectId.isValid(studyId)) {
            return NextResponse.json({ error: "Inavalid study ID" }, {status: 400})
        }

        const study = await studies.findOne({ _id: new ObjectId(studyId)})

        if (!study) {
            return NextResponse.json( study, {status: 200})
        }
    } catch (error) {
        {error: "Failed fetching study: ", error}
        {error: 500}
    }
}
