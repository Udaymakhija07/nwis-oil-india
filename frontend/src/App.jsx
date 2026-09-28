import React from "react";
import { 
  Activity, 
  MapPin, 
  Layers, 
  Compass, 
  ShieldAlert, 
  FileText, 
  Database,
  Sparkles,
  PlayCircle,
  FileCheck2
} from "lucide-react";
import { useWellStore } from "./store/useWellStore";
import Dashboard from "./pages/Dashboard";
import WellMap from "./pages/WellMap";
import OffsetCurtain from "./pages/OffsetCurtain";
import PredictiveRadar from "./pages/PredictiveRadar";
import DrillingSimulator from "./pages/DrillingSimulator";
import Copilot from "./pages/Copilot";
import Events from "./pages/Events";
import ReviewQueue from "./pages/ReviewQueue";
import Catalogue from "./pages/Catalogue";
import OffsetBrief from "./pages/OffsetBrief";

export default function App() {
  const { activeTab, setActiveTab } = useWellStore();

  const navItems = [
    { id: "dashboard", label: "Command Center", icon: Activity },
    { id: "map", label: "Well Proximity Map", icon: MapPin, badge: "GIS Pro" },
    { id: "curtain", label: "Offset Curtain", icon: Layers, badge: "Hero Visual" },
    { id: "simulator", label: "Drilling Simulator", icon: PlayCircle, badge: "Live Replay" },
    { id: "radar", label: "Look-Ahead Radar", icon: Compass, badge: "Predictive ML" },
    { id: "copilot", label: "RAG Copilot (Ask NWIS)", icon: Sparkles, badge: "AI Assistant" },
    { id: "brief", label: "Pre-Spud Offset Brief", icon: FileCheck2, badge: "PDF Report" },
    { id: "events", label: "Historical Events", icon: ShieldAlert },
    { id: "review", label: "Document AI Review", icon: FileText, badge: "Review Queue" },
    { id: "catalogue", label: "Well Catalogue (60)", icon: Database }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation - Light Enterprise Theme */}
      <aside className="w-64 flex flex-col border-r border-slate-200 bg-white select-none z-20 shrink-0 shadow-sm">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-white shadow-md shadow-amber-500/20 text-sm">
            OIL
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-slate-900">NWIS Platform</h1>
            <p className="text-xs text-slate-500 font-medium">Oil India Limited • eRTMAC</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={"w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all " +
                  (active
                    ? "bg-amber-50 text-amber-900 border border-amber-200/90 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent")}
              >
                <div className="flex items-center gap-3">
                  <Icon className={"w-4 h-4 " + (active ? "text-amber-600" : "text-slate-400")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={"text-[9px] px-2 py-0.5 rounded-full font-semibold " +
                    (active 
                      ? "bg-amber-200/60 text-amber-900 border border-amber-300/60" 
                      : "bg-slate-100 text-slate-500 border border-slate-200")}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 text-xs text-slate-500 space-y-1.5 shrink-0">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-medium text-slate-700">eRTMAC Stream</span>
            </span>
            <span className="text-emerald-700 font-bold font-mono text-[10px] bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-200">
              CONNECTED
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>SIH 2026 PS 26121</span>
            <span>v2.1.0 (Light)</span>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "map" && <WellMap />}
        {activeTab === "curtain" && <OffsetCurtain />}
        {activeTab === "simulator" && <DrillingSimulator />}
        {activeTab === "radar" && <PredictiveRadar />}
        {activeTab === "copilot" && <Copilot />}
        {activeTab === "brief" && <OffsetBrief />}
        {activeTab === "events" && <Events />}
        {activeTab === "review" && <ReviewQueue />}
        {activeTab === "catalogue" && <Catalogue />}
      </main>
    </div>
  );
}
