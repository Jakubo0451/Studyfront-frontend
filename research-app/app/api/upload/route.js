import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import dbConnect from "../../../lib/dbconnect";
import File from "../../../models/file";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExtension = file.name.split(".").pop();

    // Validation
    const allowedExtensions = ["jpg", "jpeg", "png", "pdf", "txt"];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      return NextResponse.json({ message: "Invalid file type" }, { status: 400 });
    }

    if (bytes.length > maxFileSize) {
      return NextResponse.json({ message: "File size too large" }, { status: 400 });
    }

    // Unique filename
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;

    const filePath = path.join(process.cwd(), "public/uploads", uniqueFilename);
    await writeFile(filePath, buffer);

    await dbConnect();
    const newFile = new File({
      name: uniqueFilename,
      path: `/uploads/${uniqueFilename}`,
    });
    await newFile.save();

    return NextResponse.json(
      { message: "File uploaded", path: `/uploads/${uniqueFilename}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("File upload error", error);
    return NextResponse.json({ message: "Error uploading file" }, { status: 500 });
  }
}