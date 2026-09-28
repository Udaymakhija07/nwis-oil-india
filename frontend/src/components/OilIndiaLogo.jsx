import React from "react";

export default function OilIndiaLogo({ size = 44, showText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Emblem Vector */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 filter drop-shadow-sm"
      >
        {/* Outer Circular Ring */}
        <circle cx="60" cy="60" r="56" fill="#0f265c" stroke="#d97706" strokeWidth="4" />
        <circle cx="60" cy="60" r="50" fill="#ffffff" />
        
        {/* Inner concentric ring */}
        <circle cx="60" cy="60" r="46" fill="#f8fafc" stroke="#0f265c" strokeWidth="1.5" />

        {/* Oil Derrick / Rig Silhouette & Flame */}
        <path
          d="M60 22 L72 86 L48 86 Z"
          fill="#0f265c"
        />
        {/* Derrick Crossbeams */}
        <line x1="53" y1="46" x2="67" y2="46" stroke="#ffffff" strokeWidth="2" />
        <line x1="50" y1="62" x2="70" y2="62" stroke="#ffffff" strokeWidth="2.5" />
        <line x1="48" y1="78" x2="72" y2="78" stroke="#ffffff" strokeWidth="3" />
        <line x1="53" y1="46" x2="70" y2="62" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="67" y1="46" x2="50" y2="62" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="50" y1="62" x2="72" y2="78" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="70" y1="62" x2="48" y2="78" stroke="#ffffff" strokeWidth="1.5" />

        {/* Golden Gas Flame at Top */}
        <path
          d="M60 14 C56 22 55 26 58 30 C60 26 62 25 61 22 C64 25 64 28 62 31 C67 27 65 19 60 14 Z"
          fill="#d97706"
        />
        <path
          d="M60 18 C58 22 58 24 59 26 C60 24 61 24 60 22 C62 24 62 25 61 27 C64 24 63 20 60 18 Z"
          fill="#f59e0b"
        />

        {/* Oil Drop Curves (Left and Right) */}
        <path
          d="M32 74 C32 60 44 48 44 48 C44 48 40 56 42 66 C43 71 40 76 36 78 C33 78 32 76 32 74 Z"
          fill="#d97706"
        />
        <path
          d="M88 74 C88 60 76 48 76 48 C76 48 80 56 78 66 C77 71 80 76 84 78 C87 78 88 76 88 74 Z"
          fill="#d97706"
        />

        {/* Base Foundation Arc */}
        <path
          d="M36 86 Q60 98 84 86 L86 92 Q60 105 34 92 Z"
          fill="#d97706"
        />

        {/* Bold Text "OIL" in Emblem */}
        <text
          x="60"
          y="100"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="13"
          fill="#0f265c"
          textAnchor="middle"
          letterSpacing="2"
        >
          OIL
        </text>
      </svg>

      {/* Official Typography (Bilingual) */}
      {showText && (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[13px] leading-tight text-slate-900 tracking-tight">
              ऑयल इंडिया लिमिटेड
            </span>
          </div>
          <span className="font-extrabold text-[12px] leading-tight text-[#0f265c] tracking-wide">
            Oil India Limited
          </span>
          <span className="text-[9.5px] text-slate-500 font-medium leading-tight mt-0.5">
            A Govt. of India Enterprise • Navratna
          </span>
        </div>
      )}
    </div>
  );
}
