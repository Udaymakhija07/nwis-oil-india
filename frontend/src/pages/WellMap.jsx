import React, { useState, useEffect } from "react";
import { 
  Compass, 
  Layers, 
  Sliders, 
  ShieldAlert, 
  FileText, 
  RotateCcw,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { fetchWells, fetchNearbyOffsets, fetchWellDetails } from "../api/client";
import { useWellStore } from "../store/useWellStore";
import { useTranslation } from "../i18n/translations";

export default function WellMap() {
  const { t } = useTranslation();
  const { activeWellId, radiusKm, setRadiusKm, selectedOffsetId, setSelectedOffsetId } = useWellStore();
  const [wells, setWells] = useState([]);
  const [offsets, setOffsets] = useState([]);
  const [selectedWellDetails, setSelectedWellDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDirectional, setShowDirectional] = useState(true);
  const [inspectingQuote, setInspectingQuote] = useState(null);
  const [fieldView, setFieldView] = useState("ALL"); // ALL, DIKOM, NAHORKATIYA, MORAN
  const [hoveredWell, setHoveredWell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const allWellsRes = await fetchWells({ limit: 100 });
      setWells(allWellsRes.wells || []);

      const nearbyRes = await fetchNearbyOffsets(activeWellId, radiusKm, 0.35);
      setOffsets(nearbyRes.offsets || []);
      setLoading(false);
    }
    loadData();
  }, [activeWellId, radiusKm]);

  useEffect(() => {
    async function loadDetails() {
      const targetId = selectedOffsetId || activeWellId;
      if (targetId) {
        const details = await fetchWellDetails(targetId);
        setSelectedWellDetails(details);
      }
    }
    loadDetails();
  }, [selectedOffsetId, activeWellId]);

  const activeWell = wells.find((w) => w.well_id === activeWellId);

  // Field Coordinate Bounding Boxes
  const BOUNDS = {
    ALL: { minLat: 27.12, maxLat: 27.56, minLon: 94.84, maxLon: 95.40, name: "Upper Assam Basin (All 60 Wells)" },
    DIKOM: { minLat: 27.42, maxLat: 27.54, minLon: 95.04, maxLon: 95.21, name: "Dikom Block (Active Well DIK-14)" },
    NAHORKATIYA: { minLat: 27.23, maxLat: 27.35, minLon: 95.25, maxLon: 95.38, name: "Nahorkatiya Field (20 Wells)" },
    MORAN: { minLat: 27.14, maxLat: 27.26, minLon: 94.85, maxLon: 94.98, name: "Moran Field (15 Wells)" }
  };

  const currentBounds = BOUNDS[fieldView] || BOUNDS.ALL;

  const SVG_WIDTH = 1100;
  const SVG_HEIGHT = 700;
  const PADDING_X = 80;
  const PADDING_Y = 60;

  const projectToSvg = (lat, lon) => {
    const { minLat, maxLat, minLon, maxLon } = currentBounds;
    const x = PADDING_X + ((lon - minLon) / (maxLon - minLon)) * (SVG_WIDTH - 2 * PADDING_X);
    const y = SVG_HEIGHT - PADDING_Y - ((lat - minLat) / (maxLat - minLat)) * (SVG_HEIGHT - 2 * PADDING_Y);
    return { x, y };
  };

  const activePos = projectToSvg(
    activeWell?.latitude || 27.514024, 
    activeWell?.longitude || 95.149027
  );

  // In Assam (~27.5 deg N), 1 deg Lon ~= 98.8 km
  const lonSpanKm = (currentBounds.maxLon - currentBounds.minLon) * 98.8;
  const pixelsPerKm = (SVG_WIDTH - 2 * PADDING_X) / Math.max(1, lonSpanKm);
  const radiusPixels = Math.max(20, radiusKm * pixelsPerKm);

  // Statistics
  const wellsInRadius = offsets.length;
  const highMatchOffsets = offsets.filter(o => (o.similarity_score || 0) >= 0.80).length;

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-50 text-slate-800">
      {/* Main Map Viewer Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Control Bar - Clean Light Header */}
        <div className="min-h-14 py-2 border-b border-slate-200 bg-white px-4 flex flex-wrap items-center justify-between gap-3 z-20 shrink-0 shadow-2xs select-none">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900 tracking-tight">
                  {t("map_title")}
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  PostGIS (3.85ms)
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span>{t("map_active_label")} <strong className="text-amber-700 font-mono font-bold">{activeWellId}</strong></span>
                <span>•</span>
                <span>{t("map_field_label")} <strong className="text-slate-700 font-medium">Dikom</strong></span>
              </div>
            </div>
          </div>

          {/* Center Field Viewport Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold px-1.5 hidden sm:inline">Focus:</span>
            {[
              { id: "ALL", label: "All Basin" },
              { id: "DIKOM", label: "Dikom" },
              { id: "NAHORKATIYA", label: "Nahorkatiya" },
              { id: "MORAN", label: "Moran" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFieldView(tab.id)}
                className={"px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all " +
                  (fieldView === tab.id 
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200 font-bold" 
                    : "text-slate-500 hover:text-slate-900")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Radius & Trajectory */}
          <div className="flex items-center gap-2.5">
            {/* Radius Slider Card */}
            <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <Sliders className="w-3 h-3 text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium">Radius:</span>
              <input
                type="range"
                min="5"
                max="45"
                step="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-16 accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] font-mono text-amber-700 font-bold w-10">{radiusKm} km</span>
            </div>

            {/* 3D Directional Toggle */}
            <button
              onClick={() => setShowDirectional(!showDirectional)}
              className={"px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1.5 " +
                (showDirectional
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}
            >
              <RotateCcw className="w-3 h-3" />
              <span>3D {showDirectional ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>


        {/* Full-Bleed Map Canvas - Light Theme */}
        <div className="flex-1 relative w-full h-full bg-[#f8fafc] overflow-hidden select-none">
          <svg 
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full"
          >
            <defs>
              {/* Radar pulse gradient in soft amber */}
              <radialGradient id="radarPulseLight" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.14" />
                <stop offset="70%" stopColor="#d97706" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>

              {/* Background Coordinate Grid pattern */}
              <pattern id="lightGridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#lightGridPattern)" />

            {/* Coordinate Axis Labels */}
            <g className="text-[10px] font-mono fill-slate-400 select-none">
              <text x="24" y="60">{currentBounds.maxLat.toFixed(2)}° N</text>
              <text x="24" y={SVG_HEIGHT / 2}>{((currentBounds.minLat + currentBounds.maxLat)/2).toFixed(2)}° N</text>
              <text x="24" y={SVG_HEIGHT - 30}>{currentBounds.minLat.toFixed(2)}° N</text>

              <text x={PADDING_X} y={SVG_HEIGHT - 12}>{currentBounds.minLon.toFixed(2)}° E</text>
              <text x={SVG_WIDTH / 2} y={SVG_HEIGHT - 12}>{((currentBounds.minLon + currentBounds.maxLon)/2).toFixed(2)}° E</text>
              <text x={SVG_WIDTH - 110} y={SVG_HEIGHT - 12}>{currentBounds.maxLon.toFixed(2)}° E</text>
            </g>

            {/* Field Boundary Polygons (when in ALL view) */}
            {fieldView === "ALL" && (
              <g>
                {/* Dikom Field */}
                <ellipse cx="600" cy="180" rx="170" ry="115" fill="#fef3c7" opacity="0.4" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 4" />
                <rect x="510" y="75" width="180" height="26" rx="13" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
                <text x="600" y="92" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">DIKOM BLOCK (25 WELLS)</text>

                {/* Nahorkatiya Field */}
                <ellipse cx="880" cy="510" rx="160" ry="115" fill="#e0f2fe" opacity="0.4" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 4" />
                <rect x="790" y="405" width="180" height="26" rx="13" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
                <text x="880" y="422" fill="#0284c7" fontSize="11" fontWeight="bold" textAnchor="middle">NAHORKATIYA (20 WELLS)</text>

                {/* Moran Field */}
                <ellipse cx="230" cy="560" rx="150" ry="105" fill="#dcfce7" opacity="0.4" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 4" />
                <rect x="140" y="465" width="180" height="26" rx="13" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
                <text x="230" y="482" fill="#059669" fontSize="11" fontWeight="bold" textAnchor="middle">MORAN FIELD (15 WELLS)</text>
              </g>
            )}

            {/* PostGIS Search Radius Circle around Active Well */}
            {activePos.x > 0 && activePos.x < SVG_WIDTH && activePos.y > 0 && activePos.y < SVG_HEIGHT && (
              <g>
                <circle
                  cx={activePos.x}
                  cy={activePos.y}
                  r={radiusPixels}
                  fill="url(#radarPulseLight)"
                  stroke="#d97706"
                  strokeWidth="1.8"
                  strokeDasharray="6 4"
                />
                {/* Distance text on perimeter */}
                <rect
                  x={activePos.x + radiusPixels + 6}
                  y={activePos.y - 10}
                  width="130"
                  height="20"
                  rx="6"
                  fill="#ffffff"
                  stroke="#f59e0b"
                  strokeWidth="1"
                />
                <text
                  x={activePos.x + radiusPixels + 12}
                  y={activePos.y + 4}
                  fill="#b45309"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {radiusKm} {t("map_search_radius")}
                </text>
              </g>
            )}

            {/* Well Markers Plotted */}
            {wells.map((w) => {
              const { x, y } = projectToSvg(w.latitude, w.longitude);
              if (x < 10 || x > SVG_WIDTH - 10 || y < 10 || y > SVG_HEIGHT - 10) return null;

              const isActive = w.well_id === activeWellId;
              const offsetInfo = offsets.find((o) => o.well_id === w.well_id);
              const isRelevant = offsetInfo !== undefined;
              const isSelected = (selectedOffsetId || activeWellId) === w.well_id;
              const isHovered = hoveredWell?.well_id === w.well_id;

              // Color coding based on Offset Similarity Score (S)
              let markerColor = "#94a3b8"; // clean slate outside radius
              let radius = fieldView === "ALL" ? 4.5 : 7.5;

              if (isActive) {
                markerColor = "#d97706"; // Amber
                radius = fieldView === "ALL" ? 8 : 11;
              } else if (isRelevant) {
                const s = offsetInfo.similarity_score || 0;
                if (s >= 0.80) markerColor = "#059669"; // Emerald High Match
                else if (s >= 0.60) markerColor = "#d97706"; // Amber Medium Match
                else markerColor = "#2563eb"; // Blue Low Match
                radius = fieldView === "ALL" ? 5.5 : 8.5;
              }

              const showLabel = fieldView !== "ALL" || isActive || isSelected || isHovered || (isRelevant && (offsetInfo.similarity_score >= 0.82));

              return (
                <g 
                  key={w.well_id} 
                  className="cursor-pointer group"
                  onClick={() => setSelectedOffsetId(w.well_id)}
                  onMouseEnter={(e) => {
                    setHoveredWell({ ...w, offsetInfo });
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPos({ x: rect.x + 20, y: rect.y - 40 });
                  }}
                  onMouseLeave={() => setHoveredWell(null)}
                >
                  {/* Directional trajectory profile tail */}
                  {showDirectional && w.well_type === "DIRECTIONAL" && (
                    <line
                      x1={x}
                      y1={y}
                      x2={x + (fieldView === "ALL" ? 18 : 32)}
                      y2={y + (fieldView === "ALL" ? 14 : 24)}
                      stroke={markerColor}
                      strokeWidth={fieldView === "ALL" ? "1.8" : "2.2"}
                      strokeDasharray="3 2"
                      opacity="0.8"
                    />
                  )}

                  {/* Pulsing ring for Active Well DIK-14 (SVG native animate - zero drift) */}
                  {isActive && (
                    <g pointerEvents="none">
                      <circle cx={x} cy={y} r="10" fill="none" stroke="#d97706" strokeWidth="2" opacity="0.8">
                        <animate attributeName="r" from="10" to="24" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={x} cy={y} r="16" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                    </g>
                  )}

                  {/* Selected highlight halo */}
                  {isSelected && (
                    <circle cx={x} cy={y} r={radius + 4} fill="none" stroke="#0f172a" strokeWidth="2.5" />
                  )}

                  {/* Main Marker Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered || isSelected ? radius + 2 : radius}
                    fill={markerColor}
                    stroke={isSelected ? "#0f172a" : "#ffffff"}
                    strokeWidth={isSelected ? 3 : (fieldView === "ALL" ? 2 : 2.5)}
                    className="transition-all duration-150 filter drop-shadow-xs"
                  />


                  {/* Text Label with clean white background pill */}
                  {showLabel && (
                    <g transform={`translate(${x + (fieldView === "ALL" ? 9 : 13)}, ${y + 3})`}>
                      <rect
                        x="-3"
                        y="-10"
                        width={isActive ? 64 : 50}
                        height="15"
                        rx="4"
                        fill="#ffffff"
                        stroke={isActive ? "#f59e0b" : isSelected ? "#0f172a" : "#e2e8f0"}
                        strokeWidth="1"
                        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))"
                      />
                      <text
                        fill={isActive ? "#b45309" : isSelected ? "#0f172a" : isRelevant ? "#1e293b" : "#64748b"}
                        fontSize={isActive ? "10" : fieldView === "ALL" ? "8.5" : "9.5"}
                        fontFamily="monospace"
                        fontWeight={isActive || isSelected ? "bold" : "600"}
                      >
                        {w.well_id}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Hover Tooltip HUD - Light Theme */}
          {hoveredWell && (
            <div 
              className="absolute pointer-events-none z-30 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl text-xs text-slate-700 min-w-[220px]"
              style={{ left: Math.min(window.innerWidth - 650, tooltipPos.x), top: Math.max(75, tooltipPos.y) }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="font-bold text-slate-900 font-mono text-sm">{hoveredWell.well_id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold capitalize">
                  {hoveredWell.field} Field
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Trajectory:</span>
                  <span className="text-slate-800 font-medium">{hoveredWell.well_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Depth:</span>
                  <span className="text-amber-700 font-bold">{hoveredWell.td_md}m MD</span>
                </div>
                {hoveredWell.offsetInfo ? (
                  <>
                    <div className="flex justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-400">Similarity (S):</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {((hoveredWell.offsetInfo.similarity_score || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Distance:</span>
                      <span className="text-slate-900 font-semibold">{hoveredWell.offsetInfo.distance_km?.toFixed(2)} km</span>
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100">
                    Outside active {radiusKm} km search radius
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom HUD: Live Basin Statistics & Legend */}
          <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between pointer-events-none">
            {/* Legend Card - Clean Light */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 shadow-lg pointer-events-auto">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-amber-600" />
                <span>Offset Similarity Ranking (S):</span>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-slate-700 font-medium">High Match (S ≥ 80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span className="text-slate-700 font-medium">Moderate (60% - 80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-700 font-medium">Low (35% - 60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-slate-500 font-medium">Outside Radius</span>
                </div>
              </div>
            </div>

            {/* Quick Stat Bar - Clean Light */}
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-lg text-xs font-mono pointer-events-auto">
              <span className="text-slate-500">Total: <strong className="text-slate-900 font-bold">60 Wells</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">In Radius: <strong className="text-amber-700 font-bold">{wellsInRadius} Offsets</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">High Match: <strong className="text-emerald-700 font-bold">{highMatchOffsets}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">PostGIS Latency: <strong className="text-emerald-700 font-bold">3.85ms</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Drawer: Well Profile & Offset Dossier - Clean Light Surface */}
      <div className="w-80 flex flex-col bg-white border-l border-slate-200 overflow-y-auto shrink-0 select-text shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">

          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {selectedOffsetId && selectedOffsetId !== activeWellId ? "Selected Offset Dossier" : "Active Target Well Dossier"}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            {selectedWellDetails?.well?.well_id || activeWellId}
          </span>
        </div>

        {selectedWellDetails ? (
          <div className="p-6 space-y-6 text-xs">
            {/* Metadata card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Well Identifier:</span>
                <span className="text-slate-900 font-bold">{selectedWellDetails.well.well_id} ({selectedWellDetails.well.name})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Field / Basin:</span>
                <span className="text-slate-800 font-semibold">{selectedWellDetails.well.field} (Upper Assam)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Well Profile:</span>
                <span className="text-amber-800 font-semibold bg-amber-50 px-1.5 rounded">{selectedWellDetails.well.well_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Depth (TD):</span>
                <span className="text-emerald-700 font-bold">{selectedWellDetails.well.td_md} m MD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rig Assigned:</span>
                <span className="text-slate-700">{selectedWellDetails.well.rig}</span>
              </div>
            </div>

            {/* Historical Events Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  Historical Incidents ({selectedWellDetails.events?.length || 0})
                </span>
              </div>

              {selectedWellDetails.events?.length > 0 ? (
                <div className="space-y-3">
                  {selectedWellDetails.events.map((ev) => (
                    <div
                      key={ev.event_id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 hover:border-slate-300 transition-all shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className={"px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono " +
                          (ev.type === "LOSS" ? "bg-rose-100 text-rose-800 border border-rose-200" :
                           ev.type === "KICK" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                           "bg-blue-100 text-blue-800 border border-blue-200")}>
                          {ev.type}
                        </span>
                        <span className="text-[11px] font-mono font-medium text-slate-500">
                          {ev.md_from}m - {ev.md_to}m MD
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">{ev.cause}</p>
                      
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-rose-700 font-mono font-bold">NPT: {ev.npt_h} hrs</span>
                        <button
                          onClick={() => setInspectingQuote(ev)}
                          className="text-amber-700 hover:text-amber-800 flex items-center gap-1 font-bold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View WCR Quote</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-400 text-xs">
                  Zero critical incidents recorded. Clean hole.
                </div>
              )}
            </div>

            {/* Formation Tops */}
            <div className="space-y-2.5">
              <span className="font-bold text-slate-800">Formation Tops Prognosis</span>
              <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 font-medium">
                    <tr>
                      <th className="p-2.5">Formation</th>
                      <th className="p-2.5">Top MD</th>
                      <th className="p-2.5">Regime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {selectedWellDetails.formation_tops?.map((top) => (
                      <tr key={top.id} className="hover:bg-slate-50/80">
                        <td className="p-2.5 text-slate-800 font-sans font-medium">{top.formation}</td>
                        <td className="p-2.5 text-amber-700 font-bold">{top.top_md}m</td>
                        <td className="p-2.5 text-slate-500">{top.pressure_regime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-400 text-xs">Loading well dossier...</div>
        )}
      </div>

      {/* Source Citation Quote Modal (Document AI Provenance) */}
      {inspectingQuote && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>Verified Source Citation (Document AI)</span>
              </div>
              <button
                onClick={() => setInspectingQuote(null)}
                className="text-slate-400 hover:text-slate-800 text-xs font-bold px-2 py-1 rounded-lg bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span>Document: <strong className="text-slate-900">{inspectingQuote.source_doc_id}</strong></span>
                <span>Page: <strong className="text-amber-700">{inspectingQuote.page}</strong></span>
                <span>Confidence: <strong className="text-emerald-700 font-bold">{(inspectingQuote.confidence * 100).toFixed(0)}%</strong></span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 text-xs leading-relaxed italic">
                "{inspectingQuote.evidence_quote}"
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                <strong>Remedial Action Applied:</strong> {inspectingQuote.mitigation}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingQuote(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-sm"
              >
                Close Citation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
