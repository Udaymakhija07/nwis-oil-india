import React, { useState, useEffect, useRef } from "react";
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
  FileCheck2,
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  GripVertical
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(285);
  const [isDragging, setIsDragging] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Command Center", icon: Activity, badge: null },
    { id: "map", label: "Well Proximity Map", icon: MapPin, badge: "GIS Pro" },
    { id: "curtain", label: "Offset Curtain", icon: Layers, badge: "Hero View" },
    { id: "simulator", label: "Drilling Simulator", icon: PlayCircle, badge: "Live Replay" },
    { id: "radar", label: "Look-Ahead Radar", icon: Compass, badge: "ML Risk" },
    { id: "copilot", label: "RAG Copilot (Ask NWIS)", icon: Sparkles, badge: "AI Copilot" },
    { id: "brief", label: "Pre-Spud Offset Brief", icon: FileCheck2, badge: "PDF Report" },
    { id: "events", label: "Historical Events", icon: ShieldAlert, badge: "47 Records" },
    { id: "review", label: "Document AI Review", icon: FileText, badge: "AI Hub" },
    { id: "catalogue", label: "Well Catalogue (60)", icon: Database, badge: null }
  ];

  // Drag-to-resize functionality
  const startResizing = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newWidth = Math.max(220, Math.min(420, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const currentWidth = isCollapsed ? 72 : sidebarWidth;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation - Collapsible & Draggable */}
      <aside 
        style={{ width: `${currentWidth}px` }}
        className={`flex flex-col border-r border-slate-200 bg-white select-none z-20 shrink-0 shadow-sm relative transition-[width] ${
          isDragging ? "transition-none" : "duration-200 ease-in-out"
        }`}
      >
        {/* Drag Handle on Right Border */}
        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-amber-400/80 transition-colors z-30 flex items-center justify-center group"
            title="Drag left/right to resize sidebar"
          >
            <div className="w-0.5 h-10 bg-slate-300 rounded-full group-hover:bg-amber-600 transition-colors" />
          </div>
        )}

        {/* Brand Header & Toggle Button */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between min-h-[72px]">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-white shadow-md shadow-amber-500/25 shrink-0 text-sm">
                OIL
              </div>
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm tracking-tight text-slate-900 truncate">NWIS Platform</h1>
                <p className="text-xs text-slate-500 font-medium truncate">Oil India Limited • eRTMAC</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-white shadow-md shadow-amber-500/25 text-sm shrink-0">
              OIL
            </div>
          )}

          {/* Toggle Close / Open Button */}
          {!isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition shadow-2xs shrink-0"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition shadow-2xs mx-auto mt-2"
              title="Expand Sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items with Generous Padding & Spacing */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-2xl text-[13px] font-medium transition-all group ${
                  isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3"
                } ${
                  active
                    ? "bg-amber-50 text-amber-950 border border-amber-200/90 font-bold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3.5"} min-w-0`}>
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                    active ? "text-amber-600" : "text-slate-400 group-hover:text-slate-600"
                  }`} />
                  {!isCollapsed && (
                    <span className="truncate tracking-tight font-medium text-slate-800 group-hover:text-slate-900">
                      {item.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold shrink-0 ml-2 ${
                    active 
                      ? "bg-amber-200/70 text-amber-900 border border-amber-300/80" 
                      : "bg-slate-100 text-slate-500 border border-slate-200/80"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 shrink-0">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-slate-700">eRTMAC Adapter</span>
                </span>
                <span className="text-emerald-700 font-bold font-mono text-[10px] bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-200">
                  CONNECTED
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>SIH 2026 PS 26121</span>
                <span>v2.2.0</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="eRTMAC Adapter: Connected">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
        {/* Subtle expand floating bar if collapsed */}
        {isCollapsed && (
          <div className="absolute top-4 left-4 z-30">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2 text-xs font-semibold transition"
              title="Expand Sidebar"
            >
              <PanelLeft className="w-4 h-4 text-amber-600" />
              <span>Expand Menu</span>
            </button>
          </div>
        )}

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
