import test from "node:test";
import assert from "node:assert";
import { projectOffsetDepthToActive, buildOffsetCurtain } from "../src/services/correlationService.js";

test("Correlation Engine Test Suite (P5 - Section 8)", async (t) => {
  await t.test("1. Piecewise depth alignment formula stretches depth correctly", () => {
    // Active well tops
    const activeTops = [
      { formation: "Tipam Sandstone", top_md: 1800.0, bottom_md: 2600.0 }, // span = 800m
      { formation: "Barail Coal-Shale", top_md: 2600.0, bottom_md: 3300.0 }
    ];

    // Offset well tops (thicker Tipam at different depth)
    const offsetTops = [
      { formation: "Tipam Sandstone", top_md: 1900.0, bottom_md: 2900.0 }, // span = 1000m
      { formation: "Barail Coal-Shale", top_md: 2900.0, bottom_md: 3600.0 }
    ];

    // Offset event right in middle of Tipam (at 2400m, 50% through 1000m span)
    const offsetEventDepth = 2400.0;
    const projectedDepth = projectOffsetDepthToActive(offsetEventDepth, activeTops, offsetTops);

    // Should map to 50% through active Tipam (1800 + 0.5 * 800 = 2200m)
    assert.strictEqual(projectedDepth, 2200.0);
    console.log(`Verified: Offset depth ${offsetEventDepth}m stretched to Active depth ${projectedDepth}m`);
  });

  await t.test("2. buildOffsetCurtain returns aligned tracks and density ribbon", async () => {
    const curtain = await buildOffsetCurtain("DIK-14", ["DIK-04", "DIK-02", "DIK-07"]);

    assert.strictEqual(curtain.active_well.well_id, "DIK-14");
    assert.strictEqual(curtain.active_well.current_bit_md, 2268.0);
    assert.strictEqual(curtain.offset_tracks.length, 3);
    assert.ok(curtain.density_ribbon.length > 50);

    // Verify density ribbon has at least one warning/critical zone in hazard formations
    const criticalZones = curtain.density_ribbon.filter((z) => z.risk_level === "CRITICAL" || z.risk_level === "WARNING");
    assert.ok(criticalZones.length > 0, "Expected hazard zones detected in density ribbon");
    console.log(`Verified: ${curtain.offset_tracks.length} tracks aligned, ${curtain.all_projected_events.length} events projected, ${criticalZones.length} hazard ribbon zones detected.`);
  });
});
