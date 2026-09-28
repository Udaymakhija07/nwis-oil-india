import React, { useState, useEffect } from "react";
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
  Shield,
  Clock,
  Radio
} from "lucide-react";
import { useWellStore } from "./store/useWellStore";
import OilIndiaLogo from "./components/OilIndiaLogo";
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
  const [sidebarWidth, setSidebarWidth] = useState(295);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }) + " IST");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Command Center", icon: Activity, badge: null },
    { id: "map", label: "Well Proximity Map", icon: MapPin, badge: "GIS Pro" },
    { id: "curtain", label: "Offset Curtain", icon: Layers, badge: "Hero View" },
    { id: "simulator", label: "Drilling Simulator", icon: PlayCircle, badge: "Live Stream" },
    { id: "radar", label: "Look-Ahead Radar", icon: Compass, badge: "ML Risk" },
    { id: "copilot", label: "RAG Copilot (Ask NWIS)", icon: Sparkles, badge: "AI Assistant" },
    { id: "brief", label: "Pre-Spud Offset Brief", icon: FileCheck2, badge: "Official PSHB" },
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
      const newWidth = Math.max(240, Math.min(440, e.clientX));
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

  const currentWidth = isCollapsed ? 76 : sidebarWidth;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Official Government of India & Ministry Top Banner */}
      <header className="h-9 bg-[#0b1736] text-white px-5 flex items-center justify-between text-[11px] font-medium z-30 shrink-0 border-b border-amber-500/40 select-none shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-white tracking-wide">भारत सरकार / Government of India</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">पेट्रोलियम और प्राकृतिक गैस मंत्रालय / Ministry of Petroleum & Natural Gas</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>eRTMAC Duliajan Headquarters</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
            <Shield className="w-3 h-3" />
            <span>RESTRICTED / OFFICIAL USE ONLY</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 font-mono text-slate-300 text-[10px]">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{currentTime || "LIVE IST"}</span>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden relative">
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
              <div className="w-0.5 h-12 bg-slate-300 rounded-full group-hover:bg-amber-600 transition-colors" />
            </div>
          )}

          {/* Official Brand Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between min-h-[76px] bg-slate-50/50">
            {!isCollapsed ? (
              <div className="flex items-center gap-3 overflow-hidden">
                <OilIndiaLogo size={42} showText={true} />
              </div>
            ) : (
              <div className="mx-auto">
                <OilIndiaLogo size={38} showText={false} />
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

          {/* Subsurface System Badge */}
          {!isCollapsed && (
            <div className="px-4 py-2 border-b border-slate-100 bg-[#0f265c]/5 flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#0f265c] font-mono tracking-tight">NWIS PLATFORM v2.5</span>
              <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/80 px-2 py-0.2 rounded-full border border-amber-200">
                eRTMAC Subsurface
              </span>
            </div>
          )}

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

          {/* Footer Area with Official Certification */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 shrink-0">
            {!isCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-semibold text-slate-800">eRTMAC Stream</span>
                  </span>
                  <span className="text-emerald-800 font-bold font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                    LIVE CONNECTED
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>SIH 2026 PS 26121</span>
                  <span>OIL Duliajan Asset</span>
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
    </div>
  );
}
