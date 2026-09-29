import React, { useState, useEffect } from "react";
import { 
  Layers, 
  AlertTriangle, 
  ChevronRight, 
  FileText, 
  ShieldAlert, 
  Info, 
  CheckCircle2,
  Sliders,
  ExternalLink,
  Flame,
  ArrowDown
} from "lucide-react";
import { useWellStore } from "../store/useWellStore";
import { fetchCurtainData } from "../api/client";

export default function OffsetCurtain() {
  const { activeWellId } = useWellStore();
  const [curtainData, setCurtainData] = useState(null);
  const [selectedOffsets, setSelectedOffsets] = useState(["DIK-04", "DIK-02", "DIK-07"]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const availableOffsets = ["DIK-04", "DIK-02", "DIK-07", "DIK-09", "DIK-11", "DIK-01"];

  useEffect(() => {
    async function loadCurtain() {
      setLoading(true);
      const data = await fetchCurtainData(activeWellId, selectedOffsets);
      if (data) {
        setCurtainData(data);
      }
      setLoading(false);
    }
    loadCurtain();
  }, [activeWellId, selectedOffsets]);

  const toggleOffset = (id) => {
    if (selectedOffsets.includes(id)) {
      if (selectedOffsets.length > 1) {
        setSelectedOffsets(selectedOffsets.filter((o) => o !== id));
      }
    } else {
      if (selectedOffsets.length < 4) {
        setSelectedOffsets([...selectedOffsets, id]);
      }
    }
  };

  // Modern oilfield geological pastel palette (light theme)
  const formationColors = {
    "Alluvium": "#f8fafc",
    "Dhekiajuli Sandstone": "#fed7aa",
    "Girujan Clay": "#e2e8f0",
    "Tipam Sandstone": "#fef08a", // Soft amber (Mud Loss zone)
    "Surma Group": "#f1f5f9",
    "Barail Coal-Shale": "#fbcfe8", // Soft rose/coal (Kick zone)
    "Kopili Shale": "#c7d2fe", // Soft lavender/indigo (Stuck pipe zone)
    "Jaintia Limestone": "#bae6fd"
  };

  const totalDepth = 4000;
  const depthToPercent = (md) => Math.min(100, Math.max(0, (md / totalDepth) * 100));

  const currentBitMd = 2268.0;
  const bitPosPercent = depthToPercent(currentBitMd);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 text-slate-800">
      {/* Top Header & Offset Selector Chips */}
      <div className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between z-10 shrink-0 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 tracking-tight">
                Offset Curtain • Dynamic Depth Alignment Engine
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                Hero Visual
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Active Target Well: <strong className="text-amber-700 font-mono font-bold">{activeWellId}</strong> (Active Bit @ {currentBitMd}m MD)
            </span>
          </div>
        </div>

        {/* Offset Toggle Selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 font-medium">Select Offsets:</span>
          {availableOffsets.map((id) => {
            const active = selectedOffsets.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleOffset(id)}
                className={"px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border shadow-xs " +
                  (active
                    ? "bg-amber-50 text-amber-900 border-amber-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50")}
              >
                {id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Multi-Track Well Log Viewer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Vertical Depth Ruler */}
        <div className="w-20 border-r border-slate-200 bg-white flex flex-col text-[11px] font-mono text-slate-400 select-none py-3 shrink-0 shadow-xs">
          <div className="text-center font-bold text-slate-700 pb-2 border-b border-slate-100 uppercase tracking-wider text-[10px]">
            MD (m)
          </div>
          <div className="flex-1 relative">
            {[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000].map((depth) => (
              <div
                key={depth}
                className="absolute w-full text-right pr-3 -translate-y-1/2 flex items-center justify-end gap-1.5"
                style={{ top: `${(depth / totalDepth) * 100}%` }}
              >
                <span className="font-semibold text-slate-500">{depth}</span>
                <span className="w-2 h-px bg-slate-300"></span>
              </div>
            ))}
          </div>
        </div>

        {/* Tracks Container */}
        <div className="flex-1 flex overflow-x-auto relative bg-slate-50">
          {/* Moving Active Bit Line across entire curtain */}
          <div
            className="absolute left-0 right-0 z-30 pointer-events-none transition-all duration-300"
            style={{ top: `${bitPosPercent}%` }}
          >
            <div className="relative flex items-center">
              <div className="w-full h-0.5 bg-rose-500 shadow-sm"></div>
              <span className="absolute right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Flame className="w-3.5 h-3.5" />
                Active Bit: {currentBitMd}m MD
              </span>
            </div>
          </div>

          {/* Track 1: Offset Well Left */}
          {curtainData?.offset_tracks?.slice(0, 1).map((track) => (
            <WellTrack
              key={track.well_id}
              track={track}
              isCenter={false}
              formationColors={formationColors}
              depthToPercent={depthToPercent}
              onSelectEvent={setSelectedEvent}
            />
          ))}

          {/* Risk Density Ribbon */}
          <div className="w-14 border-r border-slate-200 bg-white relative flex flex-col items-center select-none shrink-0">
            <div className="text-[10px] font-bold text-slate-600 py-2.5 border-b border-slate-100 uppercase tracking-wider">
              Risk
            </div>
            <div className="flex-1 w-full relative">
              {curtainData?.density_ribbon?.map((r, i) => {
                const topP = depthToPercent(r.depth_from);
                const heightP = depthToPercent(r.depth_to) - topP;
                let bg = "transparent";
                if (r.risk_level === "CRITICAL") bg = "rgba(239, 68, 68, 0.75)";
                else if (r.risk_level === "WARNING") bg = "rgba(245, 158, 11, 0.7)";
                else if (r.risk_level === "WATCH") bg = "rgba(59, 130, 246, 0.4)";

                return (
                  <div
                    key={i}
                    className="absolute w-full transition-all group"
                    style={{ top: `${topP}%`, height: `${heightP}%`, backgroundColor: bg }}
                    title={`Depth: ${r.depth_from}-${r.depth_to}m | Risk: ${r.risk_level} (${r.hazards.join(", ")})`}
                  />
                );
              })}
            </div>
          </div>

          {/* Center Track: Active Well DIK-14 */}
          <div className="flex-1 min-w-[280px] border-r-2 border-amber-400 bg-amber-50/20 flex flex-col relative select-none">
            <div className="p-3 border-b border-amber-200 bg-amber-100/60 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-900 font-mono flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                ACTIVE RIG: {activeWellId}
              </span>
              <span className="text-[10px] text-amber-800 font-mono font-bold bg-amber-200/80 px-2 py-0.5 rounded">
                Drilling Ahead
              </span>
            </div>

            {/* Active Formation Tops Columns */}
            <div className="flex-1 relative">
              {curtainData?.active_well?.tops?.map((top) => {
                const topP = depthToPercent(top.top_md);
                const botP = depthToPercent(top.bottom_md || top.top_md + 400);
                const heightP = Math.max(2, botP - topP);
                const isCurrent = currentBitMd >= top.top_md && currentBitMd <= (top.bottom_md || top.top_md + 400);

                return (
                  <div
                    key={top.id || top.formation}
                    className="absolute w-full border-b border-slate-300/60 px-3 py-1.5 flex justify-between items-start transition-all"
                    style={{
                      top: `${topP}%`,
                      height: `${heightP}%`,
                      backgroundColor: formationColors[top.formation] || "#f8fafc",
                      borderLeft: isCurrent ? "4px solid #d97706" : "none"
                    }}
                  >
                    <span className="text-xs font-bold text-slate-800">
                      {top.formation}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500">
                      {top.top_md}m
                    </span>
                  </div>
                );
              })}

              {/* Look-Ahead Projected Hazard Band (Next 100m) */}
              <div
                className="absolute left-0 right-0 border-2 border-dashed border-rose-500 bg-rose-500/15 backdrop-blur-xs flex items-center justify-center p-3 z-20"
                style={{
                  top: `${bitPosPercent}%`,
                  height: `${depthToPercent(2345) - bitPosPercent}%`
                }}
              >
                <div className="text-center font-bold text-rose-900 text-xs space-y-1 bg-white/90 p-3 rounded-xl shadow-md border border-rose-200">
                  <div className="flex items-center justify-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Projected Mud Loss Hazard (2,300m - 2,345m)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Tipam Sandstone • 4 Offsets Experienced Total Losses Here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining Offset Tracks (Right) */}
          {curtainData?.offset_tracks?.slice(1).map((track) => (
            <WellTrack
              key={track.well_id}
              track={track}
              isCenter={false}
              formationColors={formationColors}
              depthToPercent={depthToPercent}
              onSelectEvent={setSelectedEvent}
            />
          ))}
        </div>
      </div>

      {/* Bottom Benchmarking Bar - Clean Light */}
      <div className="h-24 border-t border-slate-200 bg-white px-8 py-4 shrink-0 flex items-center justify-between text-xs shadow-xs">
        <div className="space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Cross-Well Program Benchmark & Drilling Efficiency</span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Correlated across {selectedOffsets.length} offset wells. Benchmark Best: <strong className="text-emerald-700 font-mono font-bold">DIK-04</strong> (Lowest NPT at 5.5 hrs/1000m via 25 ppb LCM pre-treatment).
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-0.5">
            <span className="text-slate-500 text-[10px] block">Optimum Mud Weight Window:</span>
            <div className="text-amber-800 font-bold text-sm">1.28 - 1.30 sg (Tipam)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-0.5">
            <span className="text-slate-500 text-[10px] block">Intermediate Casing Shoe:</span>
            <div className="text-slate-900 font-bold text-sm">9-5/8" @ 2,680m MD</div>
          </div>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Historical Event from Offset {selectedEvent.source_well_id}
              </span>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-800 text-xs font-bold px-2 py-1 rounded bg-slate-100">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500 text-[11px] font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span>Original Depth: <strong className="text-slate-900">{selectedEvent.source_md_from}m - {selectedEvent.source_md_to}m</strong></span>
                <span>Projected Active Depth: <strong className="text-amber-700 font-bold">{selectedEvent.projected_md_from}m - {selectedEvent.projected_md_to}m</strong></span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">{selectedEvent.cause}</p>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-emerald-900 text-xs">
                <strong>Mitigation Taken:</strong> {selectedEvent.mitigation}
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono pt-1">
                <span>Source: {selectedEvent.source_doc_id} (p.{selectedEvent.page})</span>
                <span className="text-rose-700 font-bold">NPT: {selectedEvent.npt_hours} hrs</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Individual Well Track
function WellTrack({ track, isCenter, formationColors, depthToPercent, onSelectEvent }) {
  return (
    <div className="flex-1 min-w-[240px] border-r border-slate-200 bg-white flex flex-col relative select-none">
      <div className="p-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-800 font-mono">{track.well_id}</span>
        <span className="text-[11px] text-slate-500 font-mono">{track.td_md}m TD</span>
      </div>

      <div className="flex-1 relative">
        {track.tops?.map((top) => {
          const topP = depthToPercent(top.top_md);
          const botP = depthToPercent(top.bottom_md || top.top_md + 400);
          const heightP = Math.max(2, botP - topP);

          return (
            <div
              key={top.id || top.formation}
              className="absolute w-full border-b border-slate-300/40 px-3 py-1 flex justify-between items-start opacity-85 hover:opacity-100 transition-opacity"
              style={{
                top: `${topP}%`,
                height: `${heightP}%`,
                backgroundColor: formationColors[top.formation] || "#f8fafc"
              }}
            >
              <span className="text-[10px] font-semibold text-slate-800 truncate max-w-[130px]">
                {top.formation}
              </span>
              <span className="text-[9px] font-mono text-slate-500">{top.top_md}m</span>
            </div>
          );
        })}

        {/* Projected Event Badges on Track */}
        {track.events?.map((ev) => {
          const topP = depthToPercent(ev.source_md_from);

          return (
            <div
              key={ev.event_id}
              onClick={() => onSelectEvent(ev)}
              className="absolute left-2 right-2 -translate-y-1/2 cursor-pointer z-20 group"
              style={{ top: `${topP}%` }}
            >
              <div className={"p-2 rounded-xl border text-[11px] font-bold flex items-center justify-between shadow-md transition-transform group-hover:scale-105 " +
                (ev.type === "LOSS" ? "bg-rose-50 text-rose-800 border-rose-300" :
                 ev.type === "KICK" ? "bg-amber-50 text-amber-900 border-amber-300" :
                 "bg-blue-50 text-blue-900 border-blue-300")}>
                <span>{ev.type}</span>
                <span className="text-[10px] font-mono opacity-80">{ev.source_md_from}m</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
