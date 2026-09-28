import React, { useState, useEffect } from "react";
import { Database, Search, ArrowUpDown } from "lucide-react";
import { fetchWells } from "../api/client";

export default function Catalogue() {
  const [wells, setWells] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedField, setSelectedField] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetchWells({ limit: 100 });
      setWells(res.wells || []);
    }
    load();
  }, []);

  const filtered = wells.filter((w) => {
    if (selectedField && w.field !== selectedField) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return w.well_id.toLowerCase().includes(q) || w.name.toLowerCase().includes(q) || w.rig.toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 p-8 space-y-6 text-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            Oil India Limited Well Catalogue (60 Wells)
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Indexed oil and gas assets in Upper Assam: Dikom (25), Nahorkatiya (20), Moran (15).
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by well ID, rig..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {["", "Dikom", "Nahorkatiya", "Moran"].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedField(f)}
              className={"px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all " +
                (selectedField === f
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200")}
            >
              {f === "" ? "All Fields (60)" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] tracking-wider font-semibold sticky top-0">
            <tr>
              <th className="p-4">Well ID</th>
              <th className="p-4">Well Name</th>
              <th className="p-4">Field</th>
              <th className="p-4">Profile</th>
              <th className="p-4">Coordinates (Lat, Lon)</th>
              <th className="p-4">Total Depth (MD)</th>
              <th className="p-4">Rig Assigned</th>
              <th className="p-4">Spud Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filtered.map((w) => (
              <tr key={w.well_id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 text-amber-800 font-bold">{w.well_id}</td>
                <td className="p-4 text-slate-900 font-sans font-medium">{w.name}</td>
                <td className="p-4 text-slate-600 font-sans">{w.field}</td>
                <td className="p-4">
                  <span className={"px-2.5 py-0.5 rounded-full text-[10px] font-bold " +
                    (w.well_type === "DIRECTIONAL" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-slate-100 text-slate-600")}>
                    {w.well_type}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-[11px]">
                  {w.latitude.toFixed(4)}° N, {w.longitude.toFixed(4)}° E
                </td>
                <td className="p-4 text-amber-800 font-bold">{w.td_md}m</td>
                <td className="p-4 text-slate-700">{w.rig}</td>
                <td className="p-4 text-slate-500">{w.spud_date}</td>
                <td className="p-4">
                  <span className={"px-2.5 py-0.5 rounded-full text-[10px] font-bold " +
                    (w.status === "DRILLING" ? "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse" : "bg-slate-100 text-slate-600")}>
                    {w.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
