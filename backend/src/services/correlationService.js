import db from "../db/db.js";

/**
 * Piecewise formation-top depth alignment (Section 8, Page 9)
 * Maps an offset well event depth onto active well depth scale:
 * e_active = A_i + (e - O_i) * (A_{i+1} - A_i) / (O_{i+1} - O_i)
 */
export function projectOffsetDepthToActive(offsetDepth, activeTops, offsetTops) {
  if (!offsetTops || offsetTops.length === 0 || !activeTops || activeTops.length === 0) {
    return offsetDepth;
  }

  // Find which formation the offsetDepth falls into
  let matchedIdx = -1;
  for (let i = 0; i < offsetTops.length; i++) {
    const top = offsetTops[i].top_md;
    const bottom = offsetTops[i].bottom_md || (i < offsetTops.length - 1 ? offsetTops[i + 1].top_md : top + 500);
    if (offsetDepth >= top && offsetDepth <= bottom) {
      matchedIdx = i;
      break;
    }
  }

  if (matchedIdx === -1) {
    matchedIdx = offsetTops.length - 1;
  }

  const offsetTop = offsetTops[matchedIdx];
  const offsetFormationName = offsetTop.formation;

  // Find matching formation in active well
  const activeIdx = activeTops.findIndex(
    (t) => t.formation.toLowerCase() === offsetFormationName.toLowerCase()
  );

  if (activeIdx === -1) {
    // If formation missing in active well, apply constant ratio
    return offsetDepth;
  }

  const activeTop = activeTops[activeIdx];
  const O_i = offsetTop.top_md;
  const O_next = offsetTop.bottom_md || (matchedIdx < offsetTops.length - 1 ? offsetTops[matchedIdx + 1].top_md : O_i + 500);

  const A_i = activeTop.top_md;
  const A_next = activeTop.bottom_md || (activeIdx < activeTops.length - 1 ? activeTops[activeIdx + 1].top_md : A_i + 500);

  const offsetSpan = Math.max(10.0, O_next - O_i);
  const activeSpan = Math.max(10.0, A_next - A_i);

  // Piecewise stretch formula
  const projectedActiveDepth = A_i + ((offsetDepth - O_i) * activeSpan) / offsetSpan;
  return Math.round(projectedActiveDepth * 10) / 10;
}

/**
 * Builds the complete Offset Curtain data structure
 */
export async function buildOffsetCurtain(activeWellId, requestedOffsetIds = []) {
  const memoryDb = db.getMemoryDb();
  if (!memoryDb) throw new Error("Database not loaded");

  const activeWell = memoryDb.wells.find((w) => w.well_id === activeWellId);
  if (!activeWell) throw new Error(`Active well ${activeWellId} not found`);

  const activeTops = memoryDb.formation_tops
    .filter((t) => t.well_id === activeWellId)
    .sort((a, b) => a.top_md - b.top_md);

  // Default to top 3 nearby offsets if none provided
  let offsetIds = requestedOffsetIds;
  if (!offsetIds || offsetIds.length === 0) {
    offsetIds = ["DIK-04", "DIK-02", "DIK-07"];
  }

  const offsetTracks = [];
  const allProjectedEvents = [];

  for (const oId of offsetIds) {
    const oWell = memoryDb.wells.find((w) => w.well_id === oId);
    if (!oWell) continue;

    const oTops = memoryDb.formation_tops
      .filter((t) => t.well_id === oId)
      .sort((a, b) => a.top_md - b.top_md);

    const oEvents = memoryDb.events.filter((e) => e.well_id === oId);
    const oCasing = memoryDb.casing_program.filter((c) => c.well_id === oId);

    const projectedEvents = oEvents.map((ev) => {
      const projectedFrom = projectOffsetDepthToActive(ev.md_from, activeTops, oTops);
      const projectedTo = projectOffsetDepthToActive(ev.md_to, activeTops, oTops);

      const projItem = {
        event_id: ev.event_id,
        source_well_id: oId,
        source_md_from: ev.md_from,
        source_md_to: ev.md_to,
        projected_md_from: projectedFrom,
        projected_md_to: projectedTo,
        type: ev.type,
        formation: ev.formation,
        severity: ev.severity,
        npt_hours: ev.npt_h,
        cause: ev.cause,
        mitigation: ev.mitigation,
        source_doc_id: ev.source_doc_id,
        page: ev.page,
        confidence: ev.confidence
      };

      allProjectedEvents.push(projItem);
      return projItem;
    });

    offsetTracks.push({
      well_id: oId,
      name: oWell.name,
      field: oWell.field,
      td_md: oWell.td_md,
      tops: oTops,
      casing: oCasing,
      events: projectedEvents
    });
  }

  // 10m window Risk Density Profile along Active Well
  const maxDepth = activeWell.td_md || 4000;
  const windowSize = 25; // 25m bins for smooth visualization
  const densityRibbon = [];

  for (let d = 0; d < maxDepth; d += windowSize) {
    const windowStart = d;
    const windowEnd = d + windowSize;

    // Count projected events overlapping this window
    const overlapping = allProjectedEvents.filter(
      (e) => e.projected_md_to >= windowStart && e.projected_md_from <= windowEnd
    );

    let hazardScore = 0;
    const hazards = [];

    for (const ev of overlapping) {
      hazardScore += ev.severity === "CRITICAL" ? 3 : ev.severity === "WARNING" ? 2 : 1;
      hazards.push(ev.type);
    }

    densityRibbon.push({
      depth_from: windowStart,
      depth_to: windowEnd,
      center_depth: windowStart + windowSize / 2,
      hazard_score: hazardScore,
      incident_count: overlapping.length,
      hazards: [...new Set(hazards)],
      risk_level: hazardScore >= 4 ? "CRITICAL" : hazardScore >= 2 ? "WARNING" : hazardScore > 0 ? "WATCH" : "SAFE"
    });
  }

  return {
    active_well: {
      well_id: activeWell.well_id,
      name: activeWell.name,
      field: activeWell.field,
      current_bit_md: 2268.0, // Live drilling depth
      td_md: activeWell.td_md,
      tops: activeTops
    },
    offset_tracks: offsetTracks,
    all_projected_events: allProjectedEvents,
    density_ribbon: densityRibbon
  };
}
