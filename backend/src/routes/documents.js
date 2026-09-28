import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gtPath = path.resolve(__dirname, "../../../data-gen/ground_truth.json");

const router = Router();

router.get("/", (req, res) => {
  let docs = [];
  if (fs.existsSync(gtPath)) {
    try {
      const gt = JSON.parse(fs.readFileSync(gtPath, "utf-8"));
      docs = gt.map((item) => ({
        doc_id: item.doc_id,
        well_id: item.well_id,
        page: item.page,
        status: "INDEXED",
        quality_score: 0.96,
        type: item.doc_id.includes("WCR") ? "WCR" : "DDR"
      }));
    } catch (err) {}
  }
  res.json({ total: docs.length, documents: docs });
});

router.get("/:id", (req, res) => {
  const docFile = path.resolve(__dirname, `../../../data-gen/synthetic_docs/${req.params.id.replace(".pdf", ".txt")}`);
  if (fs.existsSync(docFile)) {
    const text = fs.readFileSync(docFile, "utf-8");
    return res.json({ doc_id: req.params.id, content: text });
  }
  res.status(404).json({ error: "Document not found" });
});

export default router;
