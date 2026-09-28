import { Router } from "express";
import db from "../db/db.js";

const router = Router();

router.get("/", (req, res) => {
  const memoryDb = db.getMemoryDb();
  if (!memoryDb) return res.status(500).json({ error: "Database not loaded" });

  const formationMap = new Map();

  for (const top of memoryDb.formation_tops) {
    if (!formationMap.has(top.formation)) {
      formationMap.set(top.formation, {
        name: top.formation,
        lithology: top.lithology,
        pressure_regime: top.pressure_regime,
        depths: [],
        events_count: 0
      });
    }
    formationMap.get(top.formation).depths.push(top.top_md);
  }

  for (const ev of memoryDb.events) {
    if (formationMap.has(ev.formation)) {
      formationMap.get(ev.formation).events_count += 1;
    }
  }

  const result = Array.from(formationMap.values()).map((f) => ({
    name: f.name,
    lithology: f.lithology,
    pressure_regime: f.pressure_regime,
    avg_top_md: Math.round(f.depths.reduce((a, b) => a + b, 0) / f.depths.length),
    total_events: f.events_count
  }));

  result.sort((a, b) => a.avg_top_md - b.avg_top_md);
  res.json({ formations: result });
});

export default router;
