import React from "react";

/**
 * Official Oil India Limited (OIL) Corporate Logo Component
 * Professional enterprise sizing with strict boundary containment
 */
export default function OilIndiaLogo({ 
  height = 38, 
  showText = true, 
  variant = "full", 
  className = "" 
}) {
  // Collapsed mode or icon-only variant: display the iconic "OI" mark
  if (!showText || variant === "icon") {
    return (
      <div className={`flex items-center justify-center overflow-hidden select-none ${className}`}>
        <img
          src="/oil-india-icon-transparent.png"
          alt="Oil India Monogram"
          style={{ height: `${Math.min(height, 34)}px`, maxHeight: "34px", width: "auto" }}
          className="object-contain filter drop-shadow-xs"
          onError={(e) => {
            e.target.src = "/oil-india-icon.png";
          }}
        />
      </div>
    );
  }

  // Full Expanded Mode: Displays the complete official logo neatly bounded
  return (
    <div className={`flex items-center overflow-hidden select-none ${className}`}>
      <img
        src="/oil-india-logo-clean.png"
        alt="ऑयल इंडिया लिमिटेड / Oil India Limited"
        style={{ 
          height: `${height}px`, 
          maxHeight: `${height}px`, 
          maxWidth: "100%", 
          width: "auto" 
        }}
        className="object-contain filter drop-shadow-2xs"
        onError={(e) => {
          e.target.src = "/oil-india-logo-transparent.png";
        }}
      />
    </div>
  );
}


