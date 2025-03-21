import mongoose from "mongoose"

const fileSchema = new mongoose.Schema({
    name : { type: String, required: true },
    path : { type: String, required: true },
    uploadedAt : { type: Date, default: Date.now }
});

export default mongoose.models.File || mongoose.model("File", fileSchema)