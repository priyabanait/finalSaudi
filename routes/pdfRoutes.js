// routes/pdfRoutes.js
import express from "express";
import multer from "multer";
import { uploadPdf, downloadPdf, listPdfs } from "../controllers/pdfController.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save to uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// List all PDFs route
router.get("/", listPdfs);

// Upload route
router.post("/upload", upload.single("pdf"), uploadPdf);

// Download route
router.get("/download/:name", downloadPdf);

export default router;
