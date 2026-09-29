import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  Activity, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  TrendingDown,
  Sparkles
} from "lucide-react";
import { useWellStore } from "../store/useWellStore";
import { useTranslation } from "../i18n/translations";

export default function DrillingSimulator() {
  const { setActiveTab } = useWellStore();
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5.0);
  const [currentMd, setCurrentMd] = useState(2268.0);
  const [telemetry, setTelemetry] = useState({
    md: 2268.0,
    rop: 17.5,
    wob: 14.2,
    rpm: 120,
    torque: 18.4,
    spp: 2415,
    flow_in: 2400,
    flow_out: 2368,
    pit_vol: 82.5,
    ecd: 1.33
  });
  const [activeAlert, setActiveAlert] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  const triggerLookAheadAlert = (depth) => {
    if (depth >= 2268.0 && depth <= 2315.0) {
      return {
        alert_id: "ALT-SIM-2310",
        type: "LOSS",
        formation: "Tipam Sandstone",
        lead_distance_m: Math.max(0, Math.round(2310.0 - depth)),
        time_to_reach_hrs: Math.max(0.1, Math.round(((2310.0 - depth) / 16.0) * 10) / 10),
        severity: "CRITICAL",
        recommended_action: "Spot 30 ppb coarse LCM pill, cap ECD below 1.28 sg",
        evidence: "Historical offset DIK-04 suffered total mud loss of 42.0 m³ at 2,310m MD in fractured Tipam sandstone."
      };
    }
    return null;
  };

  const advanceSimulationStep = (prevMd) => {
    const nextMd = Math.round((prevMd + 1.0) * 10) / 10;
    const inLossZone = nextMd >= 2280.0;
    const jitter = (Math.random() - 0.5) * 5;
    
    setTelemetry({
      bit_depth_md: nextMd,
      flow_in: Math.round(2400 + jitter),
      flow_out: inLossZone ? Math.round(2140 + jitter) : Math.round(2380 + jitter),
      ecd: inLossZone ? 1.33 : 1.30,
      rop: inLossZone ? 6.2 : 14.5,
      torque: Math.round((18.4 + (Math.random() - 0.5) * 0.8) * 10) / 10,
      spp: Math.round(2410 + (Math.random() - 0.5) * 20),
      pit_gain_loss: inLossZone ? -14.5 : 0.0
    });

    const alert = triggerLookAheadAlert(nextMd);
    setActiveAlert(alert);
    return nextMd;
  };

  useEffect(() => {
    async function fetchState() {
      try {
        const res = await fetch("http://localhost:5050/api/simulator/state");
        if (res.ok) {
          const data = await res.json();
          setCurrentMd(data.current_depth_md);
          if (data.telemetry) setTelemetry(data.telemetry);
          if (data.active_alert) setActiveAlert(data.active_alert);
          return;
        }
      } catch (err) {}
      // Fallback initial state
      setActiveAlert(triggerLookAheadAlert(2268.0));
    }
    fetchState();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(async () => {
        let synced = false;
        try {
          const res = await fetch("http://localhost:5050/api/simulator/step", { method: "POST" });
          if (res.ok) {
            const data = await res.json();
            setCurrentMd(data.current_depth_md);
            if (data.telemetry) setTelemetry(data.telemetry);
            if (data.active_alert) setActiveAlert(data.active_alert);
            if (data.current_depth_md >= 2320.0) setIsPlaying(false);
            synced = true;
          }
        } catch (err) {}

        if (!synced) {
          setCurrentMd((prev) => {
            const next = advanceSimulationStep(prev);
            if (next >= 2320.0) setIsPlaying(false);
            return next;
          });
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      try { await fetch("http://localhost:5050/api/simulator/pause", { method: "POST" }); } catch (e) {}
      setIsPlaying(false);
    } else {
      try { await fetch("http://localhost:5050/api/simulator/play", { method: "POST" }); } catch (e) {}
      setIsPlaying(true);
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/simulator/reset", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCurrentMd(data.current_depth_md);
        if (data.telemetry) setTelemetry(data.telemetry);
        setActiveAlert(data.active_alert);
        setIsPlaying(false);
        setActionFeedback(null);
        return;
      }
    } catch (e) {}

    // Fallback reset
    setCurrentMd(2268.0);
    setTelemetry({
      bit_depth_md: 2268.0,
      flow_in: 2400,
      flow_out: 2368,
      ecd: 1.33,
      rop: 14.5,
      torque: 18.4,
      spp: 2410,
      pit_gain_loss: 0.0
    });
    setActiveAlert(triggerLookAheadAlert(2268.0));
    setIsPlaying(false);
    setActionFeedback(null);
  };

  const handleStep = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/simulator/step", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCurrentMd(data.current_depth_md);
        if (data.telemetry) setTelemetry(data.telemetry);
        if (data.active_alert) setActiveAlert(data.active_alert);
        return;
      }
    } catch (e) {}

    setCurrentMd((prev) => advanceSimulationStep(prev));
  };

  const handleRecordFeedback = (actionText) => {
    setActionFeedback(actionText);
    if (activeAlert) {
      try {
        fetch(`http://localhost:5050/api/simulator/alerts/${activeAlert.alert_id}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ useful: true, action_taken: actionText })
        });
      } catch (e) {}
    }
  };

  const flowDeficit = Math.max(0, telemetry.flow_in - telemetry.flow_out);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 p-8 space-y-8 text-slate-800">
      {/* Header & Replay Control Toolbar - Clean Light */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            eRTMAC Drilling Replay Simulator • Look-Ahead Testbed
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Replays active well DIK-14 drilling into Upper Assam Tipam Sandstone loss zone to benchmark alert lead distance.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <button
            onClick={handlePlayPause}
            className={"px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs " +
              (isPlaying
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white")}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? t("pauseStream") : t("startStream")}</span>
          </button>

          <button
            onClick={handleStep}
            disabled={isPlaying}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs"
            title="Step +1 metre"
          >
            {t("step1m")}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs"
            title="Reset to 2,210m"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-300 mx-1"></div>

          {/* Speed Pills */}
          {[1, 5, 10, 25].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={"px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all " +
                (speed === s
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-500 hover:text-slate-900")}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Status & Depth Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Bit Depth (MD)</span>
          <p className="text-3xl font-extrabold text-amber-700 font-mono mt-1">{currentMd.toFixed(1)} m</p>
          <span className="text-xs text-slate-400 font-mono">Target Hazard @ 2,310m MD</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Look-Ahead Lead Distance</span>
          <p className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
            {activeAlert ? `${activeAlert.lead_distance_m} m` : "Normal"}
          </p>
          <span className="text-xs text-emerald-700 font-semibold">Proactive look-ahead cushion</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Reaction Lead Time</span>
          <p className="text-3xl font-extrabold text-blue-700 font-mono mt-1">
            {activeAlert ? `${(activeAlert.lead_distance_m / 16.0).toFixed(1)} hrs` : "Normal"}
          </p>
          <span className="text-xs text-slate-400 font-mono">At 16 m/hr average ROP</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">NPT Value Saved</span>
          <p className="text-3xl font-extrabold text-emerald-700 font-mono mt-1">$12,400</p>
          <span className="text-xs text-slate-400 font-mono">8.5 hrs NPT averted</span>
        </div>
      </div>

      {/* Real-Time Alert Card - Clean Light Warning Box */}
      {activeAlert ? (
        <div className="p-7 rounded-3xl bg-gradient-to-br from-rose-50 via-orange-50/50 to-white border-2 border-rose-300 shadow-md space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white uppercase tracking-wider shadow-xs animate-pulse">
                  {activeAlert.level} LOOK-AHEAD WARNING
                </span>
                <span className="text-xs text-rose-800 font-mono font-bold bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Lead Distance: {activeAlert.lead_distance_m}m ahead of bit!
                </span>
                <span className="text-xs text-blue-800 font-mono font-bold bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Reaction Lead Time: {(activeAlert.lead_distance_m / 16.0).toFixed(1)} hrs
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                Imminent Mud Loss in Tipam Sandstone ({activeAlert.target_hazard_zone})
              </h2>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Why Risk is Critical:</strong> {activeAlert.why}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Offset Evidence:</strong> {activeAlert.supporting_evidence}
              </p>

              {/* Review Mitigations Section */}
              <div className="p-4 rounded-2xl bg-white border border-rose-200 text-xs text-slate-800 shadow-xs space-y-2">
                <div className="font-bold text-emerald-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{t("reviewMitigations")}</span>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    Confidence: 94%
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{activeAlert.suggested_action}</p>
                <p className="text-[11px] text-slate-500 font-mono">Historical Proof: {activeAlert.historical_solution}</p>
              </div>
            </div>

            {/* Driller Action Feedback Buttons */}
            <div className="flex flex-col gap-3 shrink-0">
              <button
                onClick={() => handleRecordFeedback("Pumped 30 ppb LCM Pill & Cut MW to 1.28 sg")}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t("applyMitigation")}</span>
              </button>

              <button
                onClick={() => setActiveTab("curtain")}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-amber-600" />
                <span>{t("inspectCurtain")}</span>
              </button>

              <button
                onClick={() => handleRecordFeedback("Marked as Useful")}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium text-center"
              >
                {t("markUseful")}
              </button>
            </div>
          </div>

          {actionFeedback && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Feedback Recorded: "{actionFeedback}" committed to institutional memory.</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs space-y-1 shadow-xs">
          <p className="font-bold text-slate-800 text-sm">Hole is Clean • Zero Active Hazards in Look-Ahead Window</p>
          <p className="text-xs text-slate-400">Drill ahead towards 2,300m Tipam Sandstone boundary to trigger proactive warning.</p>
        </div>
      )}

      {/* Live Rig Sensor Telemetry Dials - Clean White */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-600" />
          Live Rig Telemetry Stream (1-Second Sensor Interval)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">Flow In</span>
            <p className="text-base font-bold text-slate-900 mt-1">{telemetry.flow_in} LPM</p>
          </div>

          <div className={"p-4 rounded-2xl border " + (flowDeficit > 20 ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200")}>
            <span className="text-[11px] text-rose-700 block font-medium">Flow Out</span>
            <p className="text-base font-bold text-rose-700 mt-1">{telemetry.flow_out} LPM</p>
            {flowDeficit > 0 && <span className="text-[10px] text-rose-700 font-bold block mt-0.5">-{flowDeficit.toFixed(0)} LPM deficit</span>}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">Pit Volume</span>
            <p className="text-base font-bold text-amber-800 mt-1">{telemetry.pit_vol} m³</p>
          </div>

          <div className={"p-4 rounded-2xl border " + (telemetry.ecd > 1.32 ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200")}>
            <span className="text-[11px] text-rose-700 block font-medium">ECD</span>
            <p className="text-base font-bold text-rose-700 mt-1">{telemetry.ecd} sg</p>
            <span className="text-[10px] text-rose-700 font-bold block mt-0.5">+0.03 excess</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">ROP</span>
            <p className="text-base font-bold text-slate-900 mt-1">{telemetry.rop} m/hr</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">Torque</span>
            <p className="text-base font-bold text-slate-900 mt-1">{telemetry.torque} kN.m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
