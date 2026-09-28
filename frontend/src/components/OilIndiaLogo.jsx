import React from "react";

/**
 * Official Oil India Limited (OIL) Corporate Logo Component
 * Uses the registered trademark identity (Black "O" + Red "I" Monogram + Bilingual Hindi/English typography)
 */
export default function OilIndiaLogo({ 
  height = 62, 
  showText = true, 
  variant = "full", 
  className = "" 
}) {
  // Collapsed mode or icon-only variant: display the iconic "OI" mark
  if (!showText || variant === "icon") {
    return (
      <div className={`flex items-center justify-center select-none ${className}`}>
        <img
          src="/oil-india-icon-transparent.png"
          alt="Oil India Official Emblem"
          style={{ height: `${height}px`, width: "auto" }}
          className="object-contain filter drop-shadow-xs transition-transform duration-150 hover:scale-105"
          onError={(e) => {
            e.target.src = "/oil-india-icon.png";
          }}
        />
      </div>
    );
  }

  // Full Expanded Mode: Displays the complete official logo
  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className="bg-white/90 p-1 rounded-xl transition-all duration-150 hover:bg-white flex items-center">
        <img
          src="/oil-india-logo-clean.png"
          alt="ऑयल इंडिया लिमिटेड / Oil India Limited"
          style={{ height: `${height}px`, width: "auto", maxWidth: "100%" }}
          className="object-contain filter drop-shadow-2xs transition-transform duration-150 hover:scale-[1.02]"
          onError={(e) => {
            e.target.src = "/oil-india-logo-transparent.png";
          }}
        />
      </div>
    </div>
  );
}

