import { Router } from "express";
import { buildOffsetCurtain } from "../services/correlationService.js";

const router = Router();

// GET /api/correlation/:wellId - Offset Curtain data
router.get("/:wellId", async (req, res) => {
  try {
    const { wellId } = req.params;
    const offsetsParam = req.query.offsets;
    const offsetIds = offsetsParam ? offsetsParam.split(",").map((s) => s.trim()) : [];

    const curtainData = await buildOffsetCurtain(wellId, offsetIds);
    res.json(curtainData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
