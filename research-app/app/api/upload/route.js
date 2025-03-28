import {NextResponse, nextResponse} from "next/server"
import { writeFile} from "fs/promises"
import path from "path"
import dbConnect from "../../../lib/dbconnect"
import File from "../../../models/file"

export async function POST(req){
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return nextResponse.json({ message: "No file provided"}, 400);
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = path.join(process.cwd(), "public/uploads", file.name);
        await writeFile(filePath, buffer);

        await dbConnect();
        const newFile = newFile({
            name: file.name,
            path: `/uploads/${file.name}`
        })
        await newFile.save();

        return NextResponse.json({ message: "File uploaded", path: `/uploads/${file.name}` }, { status: 200 });
    } catch (error) {
        console.log("File upload error", error);
        return NextResponse.json({ message: "Error uploading file" }, { status: 500 });
    }
}