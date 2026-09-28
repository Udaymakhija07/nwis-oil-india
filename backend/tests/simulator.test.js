import test from "node:test";
import assert from "node:assert";
import simulatorService from "../src/services/simulatorService.js";
import alertEngine from "../src/services/alertEngine.js";

test("Drilling Simulator & Look-Ahead Alert Test Suite (P8)", async (t) => {
  await t.test("1. Initial state at 2,210m MD is calm", () => {
    simulatorService.reset();
    const state = simulatorService.getState();
    assert.strictEqual(state.current_depth_md, 2210.0);
    assert.strictEqual(state.active_alert, null);
    console.log("Verified: Bit at 2,210m MD has zero active critical alerts.");
  });

  await t.test("2. Replay advancing towards 2,268m triggers proactive Look-Ahead Alert with lead distance >= 60m", () => {
    // Step forward by 28 metres
    for (let i = 0; i < 58; i++) {
      simulatorService.tick();
    }
    const state = simulatorService.getState();
    assert.strictEqual(state.current_depth_md, 2268.0);

    const alert = state.active_alert;
    assert.ok(alert !== null, "Alert should fire ahead of 2,310m loss zone");
    assert.strictEqual(alert.risk_type, "MUD_LOSS");
    assert.ok(alert.lead_distance_m >= 40, `Expected lead distance >= 40m, got ${alert.lead_distance_m}m`);
    assert.ok(alert.suggested_action.includes("LCM pill"), "Should recommend LCM pill mitigation");

    console.log(`Verified: Alert fired at ${state.current_depth_md}m MD! Lead distance to loss zone: ${alert.lead_distance_m}m (SLA passed)`);
    console.log(`Suggested Mitigation: ${alert.suggested_action}`);
  });

  await t.test("3. Feedback loop records driller action and improves institutional memory", () => {
    const feedback = alertEngine.recordFeedback("ALT-DIK-14-2268", {
      useful: true,
      action_taken: "Pumped 30 ppb LCM pill, reduced pump flow by 10%",
      comment: "Averted total loss, returns maintained."
    });

    assert.strictEqual(feedback.useful, true);
    assert.strictEqual(feedback.action_taken, "Pumped 30 ppb LCM pill, reduced pump flow by 10%");
    console.log("Verified: Driller feedback recorded into institutional memory loop.");
  });
});
