// models/Pdf.js
import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g. pdf1, pdf2
  originalName: { type: String, required: true }, // uploaded filename
  path: { type: String, required: true },   // file path on server
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Pdf", pdfSchema);
