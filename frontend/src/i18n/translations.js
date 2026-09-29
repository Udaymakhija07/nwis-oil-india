import { useWellStore } from "../store/useWellStore";

export const translations = {
  en: {
    // Brand & Header
    brandTitle: "NWIS | Nearby Wells Intelligence System",
    brandSubtitle: "Ministry of Petroleum & Natural Gas, Govt. of India",
    versionTag: "v2.5 eRTMAC",
    ertmacConnected: "eRTMAC: CONNECTED",
    officialUse: "OFFICIAL USE ONLY",
    portalModules: "Portal Modules",
    systemsCount: "10 Systems",
    ertmacStream: "eRTMAC Stream",
    liveConnected: "LIVE CONNECTED",
    assetLocation: "OIL Duliajan Asset",
    expandSidebar: "Expand Sidebar",
    collapseSidebar: "Collapse Sidebar",
    expandMenu: "Expand Menu",

    // Navigation Items
    nav_dashboard: "Command Center",
    nav_map: "Well Proximity Map",
    nav_curtain: "Offset Curtain",
    nav_simulator: "Drilling Simulator",
    nav_radar: "Look-Ahead Radar",
    nav_copilot: "RAG Copilot (Ask NWIS)",
    nav_brief: "Pre-Spud Offset Brief",
    nav_events: "Historical Events",
    nav_review: "Document AI Review",
    nav_catalogue: "Well Catalogue (60)",

    // Nav Badges
    badge_gis_pro: "GIS Pro",
    badge_hero_view: "Hero View",
    badge_live_stream: "Live Stream",
    badge_ml_risk: "ML Risk",
    badge_ai_assistant: "AI Assistant",
    badge_official_pshb: "Official PSHB",
    badge_47_records: "47 Records",
    badge_ai_hub: "AI Hub",

    // Common Actions
    startStream: "Start Real-Time Stream",
    pauseStream: "Pause Stream",
    step1m: "Step +1m",
    reset: "Reset",
    reviewMitigations: "AI Recommended Remedial Actions (Review Mitigations)",
    applyMitigation: "Review & Apply Mitigation",
    inspectCurtain: "Inspect Offset Curtain",
    markUseful: "Mark Useful",
    extractEntities: "Extract Geohazard Entities",
    extracting: "Extracting Geohazard Entities...",
    quickPresets: "Quick Presets:",
    exportPdf: "Print / Export PDF",
    searchPlaceholder: "Search well by name, field or formation...",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    english: "English",
    hindi: "हिंदी",
    themeToggle: "Toggle Light/Dark Theme",
    languageToggle: "Change Portal Language"
  },

  hi: {
    // Brand & Header
    brandTitle: "एनडब्ल्यूआईएस | समीपस्थ कूप आसूचना प्रणाली",
    brandSubtitle: "पेट्रोलियम और प्राकृतिक गैस मंत्रालय • भारत सरकार",
    versionTag: "v2.5 ई-आरटीमैक",
    ertmacConnected: "ई-आरटीमैक: लाइव सक्रिय",
    officialUse: "केवल आधिकारिक उपयोग हेतु",
    portalModules: "पोर्टल मॉड्यूल",
    systemsCount: "10 प्रणालियां",
    ertmacStream: "ई-आरटीमैक प्रवाह",
    liveConnected: "लाइव कनेक्टेड",
    assetLocation: "ऑयल दुलियाजान परिसंपत्ति",
    expandSidebar: "साइडबार खोलें",
    collapseSidebar: "साइडबार समेटें",
    expandMenu: "मेनू खोलें",

    // Navigation Items
    nav_dashboard: "कमांड सेंटर (Dashboard)",
    nav_map: "कूप सामीप्य मानचित्र (GIS Map)",
    nav_curtain: "ऑफ़सेट कर्टेन व्यू (Offset Curtain)",
    nav_simulator: "ड्रिलिंग सिम्युलेटर (Simulator)",
    nav_radar: "लुक-अहेड रडार (Risk Radar)",
    nav_copilot: "आरएजी कोपायलट (Ask NWIS)",
    nav_brief: "प्री-स्पड ब्रीफ (Pre-Spud Brief)",
    nav_events: "ऐतिहासिक घटनाएं (Historical Events)",
    nav_review: "दस्तावेज़ एआई समीक्षा (Document AI)",
    nav_catalogue: "कूप निर्देशिका (Well Catalogue)",

    // Nav Badges
    badge_gis_pro: "जीआईएस प्रो",
    badge_hero_view: "मुख्य दृश्य",
    badge_live_stream: "लाइव स्ट्रीम",
    badge_ml_risk: "एमएल जोखिम",
    badge_ai_assistant: "एआई सहायक",
    badge_official_pshb: "आधिकारिक पीएसएचबी",
    badge_47_records: "47 अभिलेख",
    badge_ai_hub: "एआई केंद्र",

    // Common Actions
    startStream: "रीयल-टाइम स्ट्रीम शुरू करें",
    pauseStream: "स्ट्रीम रोकें",
    step1m: "1 मीटर आगे",
    reset: "रीसेट करें",
    reviewMitigations: "एआई अनुशंसित उपचारात्मक कदम (शमन समीक्षा)",
    applyMitigation: "शमन उपाय लागू करें (Apply Mitigation)",
    inspectCurtain: "ऑफ़सेट कर्टेन निरीक्षण",
    markUseful: "उपयोगी चिह्नित करें",
    extractEntities: "भू-खतरा इकाइयां निकालें (Extract Entities)",
    extracting: "इकाइयों का विश्लेषण जारी...",
    quickPresets: "त्वरित नमूने:",
    exportPdf: "प्रिंट / पीडीएफ निर्यात",
    searchPlaceholder: "कूप, क्षेत्र या संरचना द्वारा खोजें...",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    english: "English",
    hindi: "हिंदी",
    themeToggle: "लाइट/डार्क थीम बदलें",
    languageToggle: "पोर्टल की भाषा बदलें"
  }
};

export function useTranslation() {
  const language = useWellStore((state) => state.language) || "en";
  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };
  return { t, language };
}
