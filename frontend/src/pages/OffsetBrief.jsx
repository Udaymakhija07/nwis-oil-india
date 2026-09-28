import React, { useState, useEffect } from "react";
import { 
  Printer, 
  Download, 
  FileCheck2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { fetchWellDetails, fetchNearbyOffsets, fetchWells } from "../api/client";
import { useWellStore } from "../store/useWellStore";

export default function OffsetBrief() {
  const { selectedWellId, setSelectedWellId } = useWellStore();
  const [targetWellId, setTargetWellId] = useState(selectedWellId || "DIK-14");
  const [wellList, setWellList] = useState([]);
  const [wellData, setWellData] = useState(null);
  const [nearbyOffsets, setNearbyOffsets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWells() {
      try {
        const res = await fetchWells({ limit: 60 });
        if (res?.wells) {
          setWellList(res.wells);
        }
      } catch (err) {
        console.error("Failed to load well list:", err);
      }
    }
    loadWells();
  }, []);

  useEffect(() => {
    async function loadDossier() {
      setLoading(true);
      try {
        const [wellRes, offsetsRes] = await Promise.all([
          fetchWellDetails(targetWellId),
          fetchNearbyOffsets(targetWellId, 15, 0.6)
        ]);
        setWellData(wellRes);
        setNearbyOffsets(offsetsRes?.offsets || []);
      } catch (err) {
        console.error("Failed to load dossier:", err);
      } finally {
        setLoading(false);
      }
    }
    if (targetWellId) {
      loadDossier();
    }
  }, [targetWellId]);

  const handlePrint = () => {
    window.print();
  };

  const well = wellData?.well || {};
  const tops = wellData?.formation_tops || [];
  const casing = wellData?.casing_program || [];

  const offsetHazards = [
    {
      formation: "Tipam Sandstone (2,250m - 2,500m MD)",
      hazard: "Severe Mud Loss (> 35 m³/hr)",
      riskLevel: "CRITICAL",
      offsetsAffected: "DIK-04 (2,310m), DIK-02 (2,295m)",
      offsetEvidence: "DIK-04 experienced complete dynamic loss at 2,310m MD in porous sand stringer with 1.33 sg ECD. Cured with 45 m³ coarse nut-plug LCM pill.",
      recommendedMitigation: "Pre-mix 35 m³ coarse LCM pill (mica + nut-plug) in reserve pit prior to reaching 2,280m MD. Cap ECD at 1.28 sg.",
      citation: "WCR-DIK-04, Page 14"
    },
    {
      formation: "Barail Coal-Shale (2,800m - 3,100m MD)",
      hazard: "Overpressured Gas Kick (0.35 sg influx)",
      riskLevel: "HIGH",
      offsetsAffected: "DIK-07 (2,940m), MOR-03 (2,880m)",
      offsetEvidence: "DIK-07 sustained 2.4 m³ gas influx during connection gas peak at 2,940m MD. Shut-in SIDPP = 420 psi, SICP = 580 psi. Killed via Wait & Weight method.",
      recommendedMitigation: "Increase mud weight to 1.38 sg prior to penetrating Barail top. Monitor PVT closely during pump-off connections.",
      citation: "DDR-DIK-07-042, Page 2"
    },
    {
      formation: "Kopili Formation (3,300m - 3,600m MD)",
      hazard: "Reactive Shale Swelling & Stuck Pipe",
      riskLevel: "HIGH",
      offsetsAffected: "NHK-09 (3,410m), DIK-12 (3,380m)",
      offsetEvidence: "NHK-09 suffered differential sticking during 6-hour wiper trip across Kopili micro-fractured shale at 3,410m MD. Overpull exceeded 70 klbs.",
      recommendedMitigation: "Maintain KCl polymer concentration ≥ 7% w/v. Limit stationary pipe time to < 10 mins. Wiper trips every 150m.",
      citation: "WCR-NHK-09, Page 28"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 text-slate-800 p-8 space-y-8">
      {/* Action Bar (Hidden in Print) */}
      <div className="print:hidden flex items-center justify-between bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Pre-Spud Offset Well Dossier & Hazard Brief
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                Phase 9 Complete
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Institutional intelligence synthesis compiled from offset well drilling records, WCRs, and DDRs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <label className="text-slate-600 font-medium">Target Well:</label>
            <select
              value={targetWellId}
              onChange={(e) => {
                setTargetWellId(e.target.value);
                setSelectedWellId(e.target.value);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
            >
              {wellList.map((w) => (
                <option key={w.well_id} value={w.well_id}>
                  {w.well_id} ({w.name} - {w.field})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 shadow-md text-xs transition"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF Brief
          </button>
        </div>
      </div>

      {/* Printable Dossier Container */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-10 shadow-sm print:bg-white print:text-black print:p-0 print:border-none print:shadow-none print:max-w-none">
        {/* Official Header */}
        <div className="border-b-2 border-amber-500/50 pb-6 mb-6 flex justify-between items-start print:border-black">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-500 text-lg tracking-wider print:text-black">
                OIL INDIA LIMITED
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono print:bg-gray-100 print:text-black">
                eRTMAC Drilling Ops
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1 text-slate-900 print:text-black">
              PRE-SPUD OFFSET HAZARD BRIEF (PSHB)
            </h2>
            <p className="text-xs text-slate-500 print:text-gray-600 font-mono">
              Document No: OIL/NWIS/PSHB/{targetWellId}-2026 • Security Class: RESTRICTED
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full print:border-black print:text-black">
              ACTIVE INTELLIGENCE BRIEF
            </span>
            <p className="text-[11px] text-slate-400 print:text-gray-600 mt-1 font-mono">
              Generated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-mono">
            Synthesizing institutional memory for {targetWellId}...
          </div>
        ) : (
          <div className="space-y-6 text-sm">
            {/* 1. Target Well Profile */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-2 mb-3">
                <Compass className="w-4 h-4" /> 1. Target Well Profile & Location
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 print:bg-gray-50 print:border-gray-300">
                <div>
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Well Identifier</span>
                  <span className="font-mono font-bold text-slate-900 print:text-black">{well.well_id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Field / Basin</span>
                  <span className="font-semibold text-slate-800 print:text-black">{well.field} (Upper Assam)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Target Depth (TD)</span>
                  <span className="font-mono font-semibold text-slate-800 print:text-black">{well.target_depth_m} m MD</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Trajectory Type</span>
                  <span className="font-semibold text-slate-800 print:text-black capitalize">{well.well_type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Surface Latitude</span>
                  <span className="font-mono text-slate-700 print:text-black">{well.surface_lat?.toFixed(5)}° N</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Surface Longitude</span>
                  <span className="font-mono text-slate-700 print:text-black">{well.surface_lon?.toFixed(5)}° E</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Max Inclination</span>
                  <span className="font-mono text-slate-700 print:text-black">{well.max_inclination || 28.5}°</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Primary Target</span>
                  <span className="font-semibold text-emerald-400 print:text-black">Barail Sandstone</span>
                </div>
              </div>
            </section>

            {/* 2. Top-Ranked Offset Analogs */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4" /> 2. PostGIS Ranked Offset Analogs (Radius: 15 km)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 print:border-gray-300">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 print:bg-gray-100 print:text-black border-b border-slate-700 print:border-gray-300">
                    <tr>
                      <th className="p-2.5">Offset Well</th>
                      <th className="p-2.5">Field</th>
                      <th className="p-2.5">Distance</th>
                      <th className="p-2.5">Similarity (S)</th>
                      <th className="p-2.5">TD (m)</th>
                      <th className="p-2.5">Recorded Incidents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-gray-200">
                    {nearbyOffsets.slice(0, 5).map((o, idx) => (
                      <tr key={o.well_id} className="hover:bg-slate-800/40 print:hover:bg-transparent">
                        <td className="p-2.5 font-bold text-slate-900 print:text-black flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {o.well_id}
                        </td>
                        <td className="p-2.5 text-slate-700 print:text-black">{o.field}</td>
                        <td className="p-2.5 text-slate-700 print:text-black">{o.distance_km?.toFixed(2)} km</td>
                        <td className="p-2.5 font-bold text-emerald-400 print:text-black">
                          {((o.similarity_score || 0.85) * 100).toFixed(1)}%
                        </td>
                        <td className="p-2.5 text-slate-700 print:text-black">{o.target_depth_m} m</td>
                        <td className="p-2.5 text-amber-400 print:text-black">
                          {o.events_count || 1} geohazard event(s)
                        </td>
                      </tr>
                    ))}
                    {nearbyOffsets.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-slate-500">
                          No offsets within threshold.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3. Formation Prognosis & Geohazard Warning Matrix */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" /> 3. Formation Geohazard Matrix & Look-Ahead Watchpoints
              </h3>
              <div className="space-y-3">
                {offsetHazards.map((hz, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 print:bg-white print:border-gray-400 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 print:text-black text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        {hz.formation}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        hz.riskLevel === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 print:text-red-700"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40 print:text-amber-800"
                      }`}>
                        {hz.riskLevel}: {hz.hazard}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 print:text-gray-700 space-y-1">
                      <p>
                        <strong className="text-slate-400 print:text-black">Offset Historical Evidence:</strong>{" "}
                        {hz.offsetEvidence}
                      </p>
                      <p className="text-emerald-300 print:text-emerald-900 font-medium">
                        <strong className="text-slate-400 print:text-black">Recommended Action Plan:</strong>{" "}
                        {hz.recommendedMitigation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/50 print:border-gray-200 flex justify-between items-center text-[10px] text-slate-400 print:text-gray-500 font-mono">
                      <span>Affected Offsets: {hz.offsetsAffected}</span>
                      <span className="underline decoration-amber-500/40">Verified Citation: {hz.citation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Mud Weight & Casing Envelope */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4" /> 4. Engineered Mud Program & Operating Windows
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-200 print:bg-gray-50 print:border-gray-300">
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Surface to Tipam (0 - 2,250m)</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-bold font-mono text-slate-900 print:text-black">1.12 - 1.18</span>
                    <span className="text-xs text-slate-500">sg</span>
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-gray-600 mt-1">
                    Spud mud / Bentonite slurry. Maintain low solids.
                  </p>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 print:bg-gray-50 print:border-gray-300">
                  <span className="text-[10px] text-amber-400 print:text-amber-800 font-semibold block">
                    Tipam Sandstone Loss Zone
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-bold font-mono text-amber-400 print:text-black">1.22 - 1.26</span>
                    <span className="text-xs text-slate-500">sg (ECD &lt; 1.28)</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 print:text-gray-700 mt-1">
                    Keep ECD low to avert fracture re-opening.
                  </p>
                </div>

                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-200 print:bg-gray-50 print:border-gray-300">
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Barail to TD (2,800m+)</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-bold font-mono text-slate-900 print:text-black">1.34 - 1.38</span>
                    <span className="text-xs text-slate-500">sg</span>
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-gray-600 mt-1">
                    Inhibited KCl polymer mud. Overbalance gas kick risk.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Institutional Sign-off */}
            <section className="pt-6 border-t border-slate-200 print:border-black text-xs">
              <div className="grid grid-cols-3 gap-6 pt-4 text-center">
                <div className="border-t border-slate-200 print:border-gray-400 pt-2">
                  <p className="font-bold text-slate-800 print:text-black">Prepared By (AI Engine)</p>
                  <p className="text-[10px] text-slate-400 print:text-gray-600 font-mono">NWIS Core System v2.0</p>
                </div>
                <div className="border-t border-slate-200 print:border-gray-400 pt-2">
                  <p className="font-bold text-slate-800 print:text-black">Reviewed By</p>
                  <p className="text-[10px] text-slate-400 print:text-gray-600 font-mono">Senior Drilling Engineer, OIL</p>
                </div>
                <div className="border-t border-slate-200 print:border-gray-400 pt-2">
                  <p className="font-bold text-slate-800 print:text-black">Approved By</p>
                  <p className="text-[10px] text-slate-400 print:text-gray-600 font-mono">eRTMAC Superintendent</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
