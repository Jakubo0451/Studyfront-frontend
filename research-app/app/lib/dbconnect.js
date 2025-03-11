import mongoose from "mongoose";

let isConnected = false;

export default async function dbConnect() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "studyfront",
        });
        isConnected = true;
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting to database", error);
        throw new Error("Error connecting to database");
    }
    
}