import alertEngine from "./alertEngine.js";

class SimulatorService {
  constructor() {
    this.isPlaying = false;
    this.speed = 1.0;
    this.intervalId = null;
    this.startDepth = 2210.0;
    this.currentDepth = 2210.0;
    this.targetDepth = 2320.0;
    this.stepSize = 1.0; // 1 metre per tick
    this.io = null;

    this.latestTelemetry = this.generateTelemetry(this.currentDepth);
  }

  setSocketIO(ioInstance) {
    this.io = ioInstance;
  }

  generateTelemetry(depth) {
    // Distance to loss zone at 2310m
    const distToLoss = 2310.0 - depth;
    let flowDeficit = 0.0;
    let pitDrop = 0.0;
    let ecd = 1.30;

    // Precursors ramp up as bit approaches 2,300m
    if (distToLoss <= 50.0 && distToLoss >= 0) {
      const progress = (50.0 - distToLoss) / 50.0;
      flowDeficit = progress * 38.0;
      pitDrop = progress * 1.8;
      ecd = 1.30 + progress * 0.04; // climbs to 1.34 sg
    } else if (distToLoss < 0) {
      // Past loss zone
      flowDeficit = 45.0;
      pitDrop = 2.4;
      ecd = 1.34;
    }

    const flowIn = 2400.0;
    const flowOut = flowIn - flowDeficit;

    return {
      well_id: "DIK-14",
      md: Math.round(depth * 10) / 10,
      rop: Math.round((16.0 + Math.random() * 4.0) * 10) / 10,
      wob: Math.round((14.0 + Math.random() * 2.0) * 10) / 10,
      rpm: 120,
      torque: Math.round((17.0 + (depth - 2240.0) * 0.05 + Math.random() * 1.0) * 10) / 10,
      spp: Math.round(2410.0 + Math.random() * 20.0),
      flow_in: flowIn,
      flow_out: Math.round(flowOut * 10) / 10,
      pit_vol: Math.round((85.0 - pitDrop) * 100) / 100,
      hookload: 148.0,
      ecd: Math.round(ecd * 100) / 100,
      formation: depth < 2650 ? "Tipam Sandstone" : "Surma Group",
      timestamp: new Date().toISOString()
    };
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const tickIntervalMs = Math.max(100, Math.round(1000 / this.speed));
    this.intervalId = setInterval(() => {
      this.tick();
    }, tickIntervalMs);
  }

  pause() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.pause();
    this.currentDepth = this.startDepth;
    this.latestTelemetry = this.generateTelemetry(this.currentDepth);
    return this.getState();
  }

  setSpeed(newSpeed) {
    this.speed = Math.max(0.5, Math.min(25.0, newSpeed));
    if (this.isPlaying) {
      this.pause();
      this.start();
    }
  }

  tick() {
    if (this.currentDepth >= this.targetDepth) {
      this.pause();
      return;
    }

    this.currentDepth += this.stepSize;
    this.latestTelemetry = this.generateTelemetry(this.currentDepth);

    // Process through alert engine
    const alert = alertEngine.processTelemetry(this.latestTelemetry);

    // Broadcast through Socket.IO if available
    if (this.io) {
      this.io.emit("telemetry_tick", this.latestTelemetry);
      if (alert) {
        this.io.emit("hazard_alert", alert);
      }
    }
  }

  getState() {
    const alert = alertEngine.processTelemetry(this.latestTelemetry);
    return {
      is_playing: this.isPlaying,
      speed: this.speed,
      current_depth_md: Math.round(this.currentDepth * 10) / 10,
      target_depth_md: this.targetDepth,
      telemetry: this.latestTelemetry,
      active_alert: alert
    };
  }
}

export const simulatorService = new SimulatorService();
export default simulatorService;
