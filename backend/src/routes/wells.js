import { Router } from "express";
import db from "../db/db.js";
import { findNearbyWells } from "../services/geoService.js";
import { nearbyWellsQuerySchema, wellsFilterSchema } from "../validators/schemas.js";

const router = Router();

// GET /api/wells - List wells with filtering and pagination
router.get("/", (req, res) => {
  try {
    const memoryDb = db.getMemoryDb();
    if (!memoryDb) {
      return res.status(500).json({ error: "Database not loaded" });
    }

    const { field, status, well_type, search, page, limit } = wellsFilterSchema.parse(req.query);

    let filtered = [...memoryDb.wells];

    if (field) {
      filtered = filtered.filter((w) => w.field.toLowerCase() === field.toLowerCase());
    }
    if (status) {
      filtered = filtered.filter((w) => w.status.toLowerCase() === status.toLowerCase());
    }
    if (well_type) {
      filtered = filtered.filter((w) => w.well_type.toLowerCase() === well_type.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((w) => w.well_id.toLowerCase().includes(q) || w.name.toLowerCase().includes(q));
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    res.json({
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      wells: paginated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/wells/:id - Single well details
router.get("/:id", (req, res) => {
  const memoryDb = db.getMemoryDb();
  const well = memoryDb?.wells.find((w) => w.well_id === req.params.id);

  if (!well) {
    return res.status(404).json({ error: `Well ${req.params.id} not found` });
  }

  const tops = memoryDb.formation_tops.filter((t) => t.well_id === well.well_id);
  const events = memoryDb.events.filter((e) => e.well_id === well.well_id);
  const casing = memoryDb.casing_program.filter((c) => c.well_id === well.well_id);

  res.json({
    well,
    formation_tops: tops,
    events,
    casing_program: casing
  });
});

// GET /api/wells/:id/nearby - PostGIS radius query with similarity ranking
router.get("/:id/nearby", async (req, res) => {
  try {
    const { radius_km, min_score, formation } = nearbyWellsQuerySchema.parse(req.query);
    const startTime = Date.now();

    const offsets = await findNearbyWells(req.params.id, {
      radiusKm: radius_km,
      minScore: min_score,
      formation
    });

    const elapsedMs = Date.now() - startTime;

    res.json({
      active_well_id: req.params.id,
      radius_km,
      min_score,
      count: offsets.length,
      latency_ms: elapsedMs,
      offsets
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/wells/:id/trajectory - 3D Minimum-curvature survey stations
router.get("/:id/trajectory", (req, res) => {
  const memoryDb = db.getMemoryDb();
  const surveys = memoryDb?.surveys.filter((s) => s.well_id === req.params.id);

  if (!surveys || surveys.length === 0) {
    return res.status(404).json({ error: `No trajectory surveys found for ${req.params.id}` });
  }

  res.json({
    well_id: req.params.id,
    stations_count: surveys.length,
    stations: surveys
  });
});

// GET /api/wells/:id/summary - Executive pre-spud summary
router.get("/:id/summary", (req, res) => {
  const memoryDb = db.getMemoryDb();
  const well = memoryDb?.wells.find((w) => w.well_id === req.params.id);
  if (!well) return res.status(404).json({ error: "Well not found" });

  const tops = memoryDb.formation_tops.filter((t) => t.well_id === well.well_id);
  const events = memoryDb.events.filter((e) => e.well_id === well.well_id);

  res.json({
    well_id: well.well_id,
    name: well.name,
    field: well.field,
    block: well.block,
    total_depth_md: well.td_md,
    total_depth_tvd: well.td_tvd,
    formations_count: tops.length,
    incidents_count: events.length,
    total_npt_hours: events.reduce((sum, e) => sum + (e.npt_h || 0), 0),
    top_hazards: [...new Set(events.map((e) => e.type))]
  });
});

export default router;
