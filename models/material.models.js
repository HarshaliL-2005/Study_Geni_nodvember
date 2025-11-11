import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
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

const Material = mongoose.model("Material", materialSchema);
export default Material;
