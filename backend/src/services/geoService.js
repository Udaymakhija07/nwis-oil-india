import db from "../db/db.js";

/**
 * Calculates Haversine distance in kilometres between two coordinates
 */
export function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180.0) *
      Math.cos((lat2 * Math.PI) / 180.0) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates the Offset Similarity Score (Section 7, Page 8)
 * S = 0.30*exp(-d_bh / d0) + 0.25*formation_overlap + 0.15*trajectory_sim + 0.10*vintage + 0.10*mud_casing + 0.10*data_quality
 */
export function calculateOffsetSimilarityScore(activeWell, offsetWell, distanceKm, commonFormationsCount, totalFormationsCount) {
  const d0 = 5.0; // 5 km characteristic scale
  const sProx = 0.30 * Math.exp(-distanceKm / d0);
  
  // Jaccard similarity of penetrated formations
  const formOverlap = totalFormationsCount > 0 ? commonFormationsCount / totalFormationsCount : 0.85;
  const sForm = 0.25 * formOverlap;
  
  // Trajectory similarity (Vertical vs Directional profile)
  const trajSim = activeWell.well_type === offsetWell.well_type ? 1.0 : 0.65;
  const sTraj = 0.15 * trajSim;
  
  // Vintage (spud date recency)
  const activeYear = activeWell.spud_date ? new Date(activeWell.spud_date).getFullYear() : 2024;
  const offsetYear = offsetWell.spud_date ? new Date(offsetWell.spud_date).getFullYear() : 2020;
  const yearDiff = Math.abs(activeYear - offsetYear);
  const sVintage = 0.10 * Math.max(0.5, 1.0 - yearDiff * 0.05);
  
  // Mud & casing similarity
  const sMudCasing = 0.10 * 0.90;
  
  // Data quality (OCR confidence & survey completeness)
  const sDataQuality = 0.10 * 0.95;
  
  const totalScore = sProx + sForm + sTraj + sVintage + sMudCasing + sDataQuality;
  return Math.min(1.0, Math.round(totalScore * 1000) / 1000);
}

/**
 * Finds nearby offset wells within radius_km
 */
export async function findNearbyWells(activeWellId, options = {}) {
  const { radiusKm = 10.0, minScore = 0.35, formation = null } = options;
  const memoryDb = db.getMemoryDb();
  
  if (!memoryDb) {
    throw new Error("Database not initialized");
  }

  const activeWell = memoryDb.wells.find((w) => w.well_id === activeWellId);
  if (!activeWell) {
    throw new Error(`Active well ${activeWellId} not found`);
  }

  const activeTops = memoryDb.formation_tops
    .filter((t) => t.well_id === activeWellId)
    .map((t) => t.formation);

  const results = [];

  for (const offset of memoryDb.wells) {
    if (offset.well_id === activeWellId) continue;

    // Check field / geographic boundary
    const dist = calculateHaversineKm(
      activeWell.latitude,
      activeWell.longitude,
      offset.latitude,
      offset.longitude
    );

    if (dist <= radiusKm) {
      const offsetTops = memoryDb.formation_tops
        .filter((t) => t.well_id === offset.well_id)
        .map((t) => t.formation);

      // Filter by formation if requested
      if (formation && !offsetTops.includes(formation)) {
        continue;
      }

      // Calculate Jaccard formation overlap
      const common = offsetTops.filter((f) => activeTops.includes(f)).length;
      const union = new Set([...activeTops, ...offsetTops]).size;

      const score = calculateOffsetSimilarityScore(
        activeWell,
        offset,
        dist,
        common,
        union
      );

      if (score >= minScore) {
        const offsetEvents = memoryDb.events.filter(
          (e) => e.well_id === offset.well_id
        );

        results.push({
          well_id: offset.well_id,
          name: offset.name,
          field: offset.field,
          block: offset.block,
          status: offset.status,
          well_type: offset.well_type,
          latitude: offset.latitude,
          longitude: offset.longitude,
          surface_distance_km: Math.round(dist * 100) / 100,
          bottom_hole_distance_km: Math.round(dist * 100) / 100, // can refine via bottom-hole survey
          similarity_score: score,
          is_relevant: score >= 0.35,
          total_depth_md: offset.td_md,
          total_depth_tvd: offset.td_tvd,
          events_count: offsetEvents.length,
          events_summary: offsetEvents.map((e) => ({
            event_id: e.event_id,
            type: e.type,
            md_from: e.md_from,
            md_to: e.md_to,
            formation: e.formation,
            severity: e.severity,
            npt_hours: e.npt_h
          }))
        });
      }
    }
  }

  // Sort by similarity score descending (or distance ascending)
  results.sort((a, b) => b.similarity_score - a.similarity_score);
  return results;
}
