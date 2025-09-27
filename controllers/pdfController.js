// controllers/pdfController.js
import Pdf from '../models/pdf.js'
import path from "path";
import fs from "fs";

export const uploadPdf = async (req, res) => {
  try {
    const { name } = req.body; // pdf1 or pdf2
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // remove old PDF if exists
    const oldPdf = await Pdf.findOne({ name });
    if (oldPdf) {
      if (fs.existsSync(oldPdf.path)) fs.unlinkSync(oldPdf.path);
      await oldPdf.deleteOne();
    }

    const newPdf = new Pdf({
      name,
      originalName: req.file.originalname,
      path: req.file.path,
    });
    await newPdf.save();

    res.json({ message: "PDF uploaded successfully", pdf: newPdf });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const downloadPdf = async (req, res) => {
  try {
    const { name } = req.params;
    const pdf = await Pdf.findOne({ name });
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    res.download(path.resolve(pdf.path), `${name}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
};
export const listPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find({}, "-__v").sort({ createdAt: -1 });
    res.json(pdfs); // this MUST be an array []
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch PDFs" });
  }
};