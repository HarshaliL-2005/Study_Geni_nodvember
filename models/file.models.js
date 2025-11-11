import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileType: {
      type: String, // pdf, image, docx, etc.
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);
export default File;
