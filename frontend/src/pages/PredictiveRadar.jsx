import React, { useState, useEffect } from "react";
import { 
  Compass, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  BarChart2, 
  CheckCircle2, 
  Flame, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  Cpu
} from "lucide-react";
import { useWellStore } from "../store/useWellStore";

export default function PredictiveRadar() {
  const { activeWellId } = useWellStore();
  const [activeFormationHorizon, setActiveFormationHorizon] = useState("TIPAM");
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calibrated geological formation horizons for Upper Assam Basin
  const scenarios = {
    TIPAM: {
      depth: 2268.0,
      formation: "Tipam Sandstone",
      params: { flow_in: 2400, flow_out: 2368, ecd: 1.33, torque: 18.4, pit_vol: 82.5, spp: 2410 },
      predictions: {
        MUD_LOSS: {
          probability: 0.865,
          composite_score: 0.857,
          risk_level: "CRITICAL",
          shap_top_3: [
            { feature: "Offset Well Loss Density", impact: "+35% risk (4 nearby offsets)" },
            { feature: "Flow Out Deficit (-32 L/min)", impact: "+25% early seepage" },
            { feature: "High ECD (1.33 sg)", impact: "+18% fracture pressure exceedance" }
          ],
          suggested_mitigation: "Pre-treat active system with 25-30 ppb coarse LCM pill. Lower flow rate by 10% to keep ECD < 1.30 sg."
        },
        STUCK_PIPE: {
          probability: 0.22,
          composite_score: 0.24,
          risk_level: "INFO",
          shap_top_3: [
            { feature: "Torque Residual CUSUM", impact: "Normal drag envelope" },
            { feature: "Offset Frequency", impact: "No tight hole in Tipam" }
          ],
          suggested_mitigation: "Maintain steady rotary speed > 100 RPM."
        },
        KICK: {
          probability: 0.15,
          composite_score: 0.18,
          risk_level: "INFO",
          shap_top_3: [
            { feature: "D-Exponent Pore Pressure", impact: "Normal pore pressure" }
          ],
          suggested_mitigation: "Standard flow checks on connections."
        }
      }
    },
    BARAIL: {
      depth: 3150.0,
      formation: "Barail Coal-Shale",
      params: { flow_in: 2200, flow_out: 2245, ecd: 1.36, torque: 21.2, pit_vol: 84.8, spp: 2550 },
      predictions: {
        MUD_LOSS: {
          probability: 0.32,
          composite_score: 0.35,
          risk_level: "WATCH",
          shap_top_3: [
            { feature: "Moderate Permeability", impact: "+15% seepage" },
            { feature: "Offset Loss Logs", impact: "1 minor loss event" }
          ],
          suggested_mitigation: "Keep 15 ppb fine calcium carbonate in reserve."
        },
        STUCK_PIPE: {
          probability: 0.28,
          composite_score: 0.30,
          risk_level: "WATCH",
          shap_top_3: [
            { feature: "Coal Intercalations", impact: "+18% mechanical drag" },
            { feature: "Dogleg Stability", impact: "Acceptable 2.4°/30m" }
          ],
          suggested_mitigation: "Perform wiper trip every 150m."
        },
        KICK: {
          probability: 0.794,
          composite_score: 0.812,
          risk_level: "CRITICAL",
          shap_top_3: [
            { feature: "High Gas Peak (140 units)", impact: "+45% hydrocarbon surge" },
            { feature: "Pore Pressure Ramp (1.35 SG)", impact: "+28% overpressure" },
            { feature: "Flow Out Increase (+25 LPM)", impact: "+16% kick indicator" }
          ],
          suggested_mitigation: "Weight up active mud to 1.38 SG. Space out, shut down mud pumps, and perform immediate flow check."
        }
      }
    },
    KOPILI: {
      depth: 3650.0,
      formation: "Kopili Shale Transition",
      params: { flow_in: 2100, flow_out: 2095, ecd: 1.38, torque: 26.5, pit_vol: 82.0, spp: 2720 },
      predictions: {
        MUD_LOSS: {
          probability: 0.18,
          composite_score: 0.20,
          risk_level: "INFO",
          shap_top_3: [
            { feature: "Low Formation Permeability", impact: "Impermeable shale" }
          ],
          suggested_mitigation: "Standard drilling fluid monitoring."
        },
        STUCK_PIPE: {
          probability: 0.824,
          composite_score: 0.841,
          risk_level: "CRITICAL",
          shap_top_3: [
            { feature: "Smectite Reactive Clay Swelling", impact: "+40% severe tight hole" },
            { feature: "High Dogleg Severity (4.1°/30m)", impact: "+26% key seating risk" },
            { feature: "Overbalance Drag Margin", impact: "+18% differential sticking" }
          ],
          suggested_mitigation: "Add PHPA clay stabilizer to mud. Pump high-viscosity sweeps every 2 stands. Limit static connection time to < 2 minutes."
        },
        KICK: {
          probability: 0.12,
          composite_score: 0.15,
          risk_level: "INFO",
          shap_top_3: [
            { feature: "Pore Pressure Envelope", impact: "Normal hydrostatic" }
          ],
          suggested_mitigation: "Standard mud logging monitoring."
        }
      }
    }
  };

  const currentScenario = scenarios[activeFormationHorizon];
  const predictions = currentScenario.predictions;
  const currentParams = currentScenario.params;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 p-8 space-y-6 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            Look-Ahead Radar • Predictive ML Risk Suite
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time hybrid AI forecasting 100m ahead of drill bit with SHAP explainability and offset evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-medium shadow-xs">
          <Activity className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          <span>Bit @ {currentScenario.depth}m MD ({currentScenario.formation})</span>
        </div>
      </div>

      {/* Interactive Horizon Forecast Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            Simulate Horizon:
          </span>
          <span className="text-xs text-slate-400">|</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveFormationHorizon("TIPAM")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeFormationHorizon === "TIPAM"
                ? "bg-rose-50 text-rose-900 border-2 border-rose-300 font-bold shadow-xs"
                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200/70"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>1. Tipam Sandstone @ 2,268m (Severe Mud Loss Zone)</span>
          </button>

          <button
            onClick={() => setActiveFormationHorizon("BARAIL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeFormationHorizon === "BARAIL"
                ? "bg-amber-50 text-amber-900 border-2 border-amber-400 font-bold shadow-xs"
                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200/70"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>2. Barail Gas Sand @ 3,150m (Gas Kick Risk)</span>
          </button>

          <button
            onClick={() => setActiveFormationHorizon("KOPILI")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeFormationHorizon === "KOPILI"
                ? "bg-blue-50 text-blue-900 border-2 border-blue-300 font-bold shadow-xs"
                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200/70"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>3. Kopili Transition @ 3,650m (Stuck Pipe Risk)</span>
          </button>
        </div>
      </div>


      {/* Main 3 Hazard Predictor Cards */}
      {predictions && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mud Loss Hazard (CRITICAL) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/90 via-orange-50/40 to-white border-2 border-rose-300 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white uppercase tracking-wider shadow-xs">
                  {predictions.MUD_LOSS.risk_level} ALERT
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Severe Mud Loss Risk
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-rose-700 font-mono">
                  {(predictions.MUD_LOSS.composite_score * 100).toFixed(0)}%
                </span>
                <p className="text-[11px] text-slate-500 font-mono">Composite Risk</p>
              </div>
            </div>

            {/* Probability bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Model Calibrated Probability:</span>
                <span className="text-slate-900 font-mono font-bold">{(predictions.MUD_LOSS.probability * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-rose-100 overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded-full"
                  style={{ width: `${predictions.MUD_LOSS.probability * 100}%` }}
                ></div>
              </div>
            </div>

            {/* SHAP Top-3 Feature Drivers */}
            <div className="p-4 rounded-2xl bg-white border border-rose-200/80 space-y-2.5 text-xs shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-amber-600" />
                  SHAP Explainability (Top Drivers):
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {predictions.MUD_LOSS.shap_top_3.map((shap, si) => (
                  <div key={si} className="flex justify-between items-center text-slate-600">
                    <span className="truncate max-w-[180px]">{shap.feature}</span>
                    <span className="text-rose-700 font-bold">{shap.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Driller Action */}
            <div className="p-3.5 rounded-2xl bg-rose-100/60 border border-rose-200 text-rose-900 text-xs font-mono space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs text-rose-800">
                <Cpu className="w-3.5 h-3.5 text-rose-700" />
                Suggested Mitigating Action:
              </div>
              <p className="text-xs leading-relaxed font-sans">{predictions.MUD_LOSS.suggested_mitigation}</p>
            </div>
          </div>

          {/* Stuck Pipe Hazard (INFO) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  {predictions.STUCK_PIPE.risk_level}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-2 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-blue-600" />
                  Stuck Pipe Risk
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-slate-700 font-mono">
                  {(predictions.STUCK_PIPE.composite_score * 100).toFixed(0)}%
                </span>
                <p className="text-[11px] text-slate-400 font-mono">Composite Risk</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Model Probability:</span>
                <span className="text-slate-900 font-mono font-bold">{(predictions.STUCK_PIPE.probability * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${predictions.STUCK_PIPE.probability * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                SHAP Explainability:
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {predictions.STUCK_PIPE.shap_top_3.map((shap, si) => (
                  <div key={si} className="flex justify-between items-center text-slate-500">
                    <span>{shap.feature}</span>
                    <span className="text-emerald-700 font-bold">{shap.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
              <div className="font-bold text-slate-700 text-xs">Operational Status:</div>
              <p className="text-xs">{predictions.STUCK_PIPE.suggested_mitigation}</p>
            </div>
          </div>

          {/* Kick / Overpressure Hazard (INFO) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  {predictions.KICK.risk_level}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-2 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-blue-600" />
                  Gas Kick / Overpressure
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-slate-700 font-mono">
                  {(predictions.KICK.composite_score * 100).toFixed(0)}%
                </span>
                <p className="text-[11px] text-slate-400 font-mono">Composite Risk</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Model Probability:</span>
                <span className="text-slate-900 font-mono font-bold">{(predictions.KICK.probability * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${predictions.KICK.probability * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                SHAP Explainability:
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {predictions.KICK.shap_top_3.map((shap, si) => (
                  <div key={si} className="flex justify-between items-center text-slate-500">
                    <span>{shap.feature}</span>
                    <span className="text-emerald-700 font-bold">{shap.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
              <div className="font-bold text-slate-700 text-xs">Operational Status:</div>
              <p className="text-xs">{predictions.KICK.suggested_mitigation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Precursor Sensor Stream */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-600" />
            Live Precursor Sensor Stream (eRTMAC Adapter)
          </span>
          <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            1-SECOND INTERVAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">Flow In</span>
            <p className="text-base font-bold text-slate-900 mt-1">{currentParams.flow_in.toLocaleString()} LPM</p>
          </div>
          <div className={`p-4 rounded-2xl border ${
            currentParams.flow_out < currentParams.flow_in 
              ? "bg-rose-50 border-rose-200 text-rose-700" 
              : currentParams.flow_out > currentParams.flow_in
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-slate-50 border-slate-200 text-slate-900"
          }`}>
            <span className="text-[11px] block font-medium">Flow Out</span>
            <p className="text-base font-bold mt-1">{currentParams.flow_out.toLocaleString()} LPM</p>
            <span className="text-[10px] font-bold block mt-0.5">
              {currentParams.flow_out - currentParams.flow_in < 0 
                ? `${currentParams.flow_out - currentParams.flow_in} LPM deficit` 
                : currentParams.flow_out - currentParams.flow_in > 0
                ? `+${currentParams.flow_out - currentParams.flow_in} LPM surge`
                : "Balanced"}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">Pit Volume</span>
            <p className="text-base font-bold text-amber-800 mt-1">{currentParams.pit_vol} m³</p>
          </div>
          <div className={`p-4 rounded-2xl border ${
            currentParams.ecd > 1.35 ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-slate-50 border-slate-200"
          }`}>
            <span className="text-[11px] text-slate-400 block font-medium">ECD</span>
            <p className="text-base font-bold text-slate-900 mt-1">{currentParams.ecd} sg</p>
          </div>
          <div className={`p-4 rounded-2xl border ${
            currentParams.torque > 25 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-slate-50 border-slate-200"
          }`}>
            <span className="text-[11px] text-slate-400 block font-medium">Torque</span>
            <p className="text-base font-bold text-slate-900 mt-1">{currentParams.torque} kN.m</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">SPP</span>
            <p className="text-base font-bold text-slate-900 mt-1">{currentParams.spp} psi</p>
          </div>
        </div>

      </div>
    </div>
  );
}
