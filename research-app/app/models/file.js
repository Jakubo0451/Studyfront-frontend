import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255,
    },
    path: {
        type: String,
        required: true,
        match: /^(\/[a-zA-Z0-9_\-\.]+)+$/,
    },
    uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.File || mongoose.model("File", fileSchema);