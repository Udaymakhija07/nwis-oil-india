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
  Radio,
  Sun,
  Moon,
  Languages
} from "lucide-react";
import { useWellStore } from "./store/useWellStore";
import { useTranslation } from "./i18n/translations";
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
  const { activeTab, setActiveTab, theme, language, toggleTheme, toggleLanguage } = useWellStore();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
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
    { id: "dashboard", label: t("nav_dashboard"), icon: Activity, badge: null },
    { id: "map", label: t("nav_map"), icon: MapPin, badge: t("badge_gis_pro") },
    { id: "curtain", label: t("nav_curtain"), icon: Layers, badge: t("badge_hero_view") },
    { id: "simulator", label: t("nav_simulator"), icon: PlayCircle, badge: t("badge_live_stream") },
    { id: "radar", label: t("nav_radar"), icon: Compass, badge: t("badge_ml_risk") },
    { id: "copilot", label: t("nav_copilot"), icon: Sparkles, badge: t("badge_ai_assistant") },
    { id: "brief", label: t("nav_brief"), icon: FileCheck2, badge: t("badge_official_pshb") },
    { id: "events", label: t("nav_events"), icon: ShieldAlert, badge: t("badge_47_records") },
    { id: "review", label: t("nav_review"), icon: FileText, badge: t("badge_ai_hub") },
    { id: "catalogue", label: t("nav_catalogue"), icon: Database, badge: null }
  ];

  // Drag-to-resize functionality
  const startResizing = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newWidth = Math.max(220, Math.min(380, e.clientX));
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

  const currentWidth = isCollapsed ? 68 : Math.max(240, sidebarWidth);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Unified Professional Top Enterprise Navigation Bar (Zero Stacking) */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shrink-0 shadow-xs select-none overflow-hidden">
        {/* Left: Brand Identity & Official Oil India Limited Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeft className="w-5 h-5 text-amber-600" /> : <PanelLeftClose className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Official Oil India Limited Logo - Clean & Bounded */}
          <div className="flex items-center shrink-0">
            <img 
              src="/oil-india-logo-clean.png" 
              alt="Oil India Limited" 
              style={{ height: "34px", maxHeight: "34px", width: "auto" }}
              className="object-contain" 
            />
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block shrink-0" />

          {/* Platform Title & Ministry Attribution */}
          <div className="hidden md:flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[13px] text-[#0f265c] tracking-tight truncate">
                {t("brandTitle")}
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200/80 shrink-0">
                {t("versionTag")}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium truncate">
              {t("brandSubtitle")}
            </span>
          </div>
        </div>

        {/* Right: Telemetry Status, Official Classification, Language/Theme Toggles & Live Clock */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden xl:inline text-slate-500 text-[10px]">eRTMAC:</span>
            <span className="font-mono text-emerald-800 font-bold text-[10px]">{t("ertmacConnected")}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-600 font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{currentTime || "LIVE IST"}</span>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-0.5" />

          {/* Bilingual Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition cursor-pointer shadow-xs"
            title={t("languageToggle")}
          >
            <Languages className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-bold">{language === "hi" ? "हिंदी" : "EN"}</span>
            <span className="text-[10px] text-slate-400 font-normal">|</span>
            <span className="text-[10px] text-slate-500 font-normal">{language === "hi" ? "EN" : "हिंदी"}</span>
          </button>

          {/* Dark / Light Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-amber-600 transition cursor-pointer shadow-xs"
            title={t("themeToggle")}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 fill-slate-400/20" />
            )}
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Navigation - Collapsible & Draggable */}
        <aside 
          style={{ width: `${currentWidth}px` }}
          className={`flex flex-col border-r border-slate-200 bg-white select-none z-20 shrink-0 shadow-xs relative transition-[width] ${
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

          {/* Sidebar Section Sub-header */}
          {!isCollapsed && (
            <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">{t("portalModules")}</span>
              <span className="text-[10px] text-amber-800 font-bold font-mono bg-amber-100/80 px-1.5 py-0.2 rounded border border-amber-200">
                {t("systemsCount")}
              </span>
            </div>
          )}

          {/* Navigation Items with Generous Padding & Spacing */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">

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
                    <span className="text-xs font-semibold text-slate-800">{t("ertmacStream")}</span>
                  </span>
                  <span className="text-emerald-800 font-bold font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                    {t("liveConnected")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>SIH 2026 PS 26121</span>
                  <span>{t("assetLocation")}</span>
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
                title={t("expandSidebar")}
              >
                <PanelLeft className="w-4 h-4 text-amber-600" />
                <span>{t("expandMenu")}</span>
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
