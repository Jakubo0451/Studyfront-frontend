import mongoose from "mongoose";

const studySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    question: [
      {
        // This is an array of question objects
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, required: true },
        data: { type: mongoose.Schema.Types.Mixed, required: true },
        file: { type: mongoose.Schema.Types.Mixed }, // Metadata
      },
    ],
    files: [
      {
        //Array of file metadata
        filename: String,
        path: String,
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Study || mongoose.model("Study", studySchema);
