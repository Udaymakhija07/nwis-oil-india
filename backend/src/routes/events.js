import { Router } from "express";
import db from "../db/db.js";
import { eventsFilterSchema } from "../validators/schemas.js";

const router = Router();

// GET /api/events - Filter events
router.get("/", (req, res) => {
  try {
    const memoryDb = db.getMemoryDb();
    if (!memoryDb) return res.status(500).json({ error: "Database not loaded" });

    const { well_id, type, formation, severity, md_from, md_to, page, limit } = eventsFilterSchema.parse(req.query);

    let filtered = [...memoryDb.events];

    if (well_id) filtered = filtered.filter((e) => e.well_id === well_id);
    if (type) filtered = filtered.filter((e) => e.type && e.type.toLowerCase() === type.toLowerCase());
    if (formation) filtered = filtered.filter((e) => e.formation && e.formation.toLowerCase().includes(formation.toLowerCase()));
    if (severity) filtered = filtered.filter((e) => e.severity && e.severity.toLowerCase() === severity.toLowerCase());
    if (md_from !== undefined) filtered = filtered.filter((e) => e.md_to >= md_from);
    if (md_to !== undefined) filtered = filtered.filter((e) => e.md_from <= md_to);

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    res.json({
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      events: paginated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/events/stats - Aggregated NPT & Risk statistics
router.get("/stats", (req, res) => {
  const memoryDb = db.getMemoryDb();
  if (!memoryDb) return res.status(500).json({ error: "Database not loaded" });

  const events = memoryDb.events;
  const byType = {};
  const byFormation = {};
  let totalNpt = 0;

  for (const e of events) {
    byType[e.type] = (byType[e.type] || 0) + 1;
    byFormation[e.formation] = (byFormation[e.formation] || 0) + 1;
    totalNpt += e.npt_h || 0;
  }

  res.json({
    total_events: events.length,
    total_npt_hours: Math.round(totalNpt * 10) / 10,
    estimated_cost_usd: Math.round(totalNpt * (35000 / 24)), // $35k/day rig rate
    by_type: byType,
    by_formation: byFormation
  });
});

export default router;
