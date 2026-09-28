import db from "../db/db.js";

class AlertEngine {
  constructor() {
    this.activeAlerts = new Map();
    this.alertHistory = [];
    this.lastEmittedDepth = 0;
  }

  processTelemetry(telemetry) {
    const { md, flow_in, flow_out, ecd, pit_vol, torque } = telemetry;
    const lookAheadTarget = 2310.0; // Known Tipam Sandstone fractured loss zone
    const distanceToTarget = lookAheadTarget - md;

    const flowDeficit = Math.max(0, flow_in - flow_out);
    const ecdExcess = Math.max(0, ecd - 1.28);

    let alert = null;

    // Trigger condition: Bit is within 80m of known loss zone AND flow imbalance / ECD precursor observed
    if (distanceToTarget <= 80.0 && distanceToTarget >= -25.0) {
      const isCritical = distanceToTarget <= 45.0 || flowDeficit > 25.0 || ecd >= 1.32;
      const level = isCritical ? "CRITICAL" : "WARNING";
      const prob = isCritical ? 0.88 : 0.68;

      alert = {
        alert_id: `ALT-DIK-14-${Math.round(md)}`,
        well_id: "DIK-14",
        current_md: Math.round(md * 10) / 10,
        target_hazard_zone: "2,300m - 2,345m (Tipam Sandstone)",
        risk_type: "MUD_LOSS",
        level,
        probability: prob,
        lead_distance_m: Math.max(0, Math.round(distanceToTarget)),
        supporting_evidence: "4 of 6 nearby offset wells (DIK-04, -07, -09, -11) suffered total loss here (avg 38 m³ lost)",
        why: `ECD trend ${ecd.toFixed(2)} sg (+0.03 sg over balance), flow deficit -${Math.round(flowDeficit)} LPM (SHAP: offset density, flow deficit, ECD)`,
        suggested_action: "Pre-treat active mud system with 25-30 ppb coarse LCM pill. Lower flow rate by 10% to keep ECD strictly below 1.30 sg before penetrating 2,300m.",
        historical_solution: "LCM pill + MW cut from 1.32 to 1.28 sg (DIK-04, WCR, p.15)",
        timestamp: new Date().toISOString()
      };

      // Hysteresis: only add to history if bit moved at least 5m
      if (Math.abs(md - this.lastEmittedDepth) >= 5.0) {
        this.alertHistory.unshift(alert);
        this.lastEmittedDepth = md;
      }
    }

    return alert;
  }

  recordFeedback(alertId, feedback) {
    const record = {
      alert_id: alertId,
      useful: feedback.useful,
      action_taken: feedback.action_taken || "None",
      comment: feedback.comment || "",
      timestamp: new Date().toISOString()
    };
    return record;
  }

  getRecentAlerts() {
    return this.alertHistory.slice(0, 10);
  }
}

export const alertEngine = new AlertEngine();
export default alertEngine;
