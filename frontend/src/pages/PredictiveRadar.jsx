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
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentBitDepth = 2268.0;

  useEffect(() => {
    async function loadPredictions() {
      try {
        const res = await fetch("http://localhost:5050/api/ml/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            active_depth_md: currentBitDepth,
            current_params: { flow_in: 2400, flow_out: 2368, ecd: 1.33, torque: 18.4, pit_vol: 82.5 },
            aligned_offsets: ["DIK-04", "DIK-02", "DIK-07", "DIK-09"]
          })
        });
        if (res.ok) {
          setPredictionData(await res.json());
        }
      } catch (err) {}
      setLoading(false);
    }
    loadPredictions();
  }, [activeWellId]);

  const predictions = predictionData?.predictions;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 p-8 space-y-8 text-slate-800">
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
          <span>Active Bit @ {currentBitDepth}m MD (Tipam Sandstone)</span>
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
            <p className="text-base font-bold text-slate-900 mt-1">2,400 LPM</p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] text-rose-700 block font-medium">Flow Out</span>
            <p className="text-base font-bold text-rose-700 mt-1">2,368 LPM</p>
            <span className="text-[10px] text-rose-700 font-bold block mt-0.5">-32 LPM deficit</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">Pit Volume</span>
            <p className="text-base font-bold text-amber-800 mt-1">82.5 m³</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">-0.8 m³ drift</span>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] text-rose-700 block font-medium">ECD</span>
            <p className="text-base font-bold text-rose-700 mt-1">1.33 sg</p>
            <span className="text-[10px] text-rose-700 font-bold block mt-0.5">+0.03 sg excess</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">Torque</span>
            <p className="text-base font-bold text-slate-900 mt-1">18.4 kN.m</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Normal</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">SPP</span>
            <p className="text-base font-bold text-slate-900 mt-1">2,410 psi</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Stable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
