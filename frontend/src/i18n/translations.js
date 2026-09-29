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
    languageToggle: "Change Portal Language",

    // Dashboard (Command Center)
    dash_title: "Rig Command Center • Real-Time Decision Support",
    dash_subtitle: "Oil India Limited • eRTMAC Stream Integration • Upper Assam Basin Drilling Operations",
    dash_live_feed: "Live Rig Feed: Active (1.2s lag)",
    dash_kpi_wells: "Offset Wells Indexed",
    dash_kpi_wells_val: "60 Wells",
    dash_kpi_wells_sub: "100% PostGIS Geocoded",
    dash_kpi_npt: "Historical NPT Tracked",
    dash_kpi_npt_sub: "Extracted from 47 WCR/DDR reports",
    dash_kpi_npt_unit: "Hours",
    dash_kpi_cost: "Estimated Cost Avoided",
    dash_kpi_cost_sub: "Averting 1 stuck pipe or kick event",
    dash_kpi_doc_ai: "Document AI Extraction",
    dash_kpi_doc_ai_sub: "100% Ground Truth Accuracy",
    dash_lookahead_badge: "Active Look-Ahead Warning",
    dash_lookahead_sub: "Active Bit @ 2,268m MD • Approaching Hazard Zone: 2,300m - 2,345m",
    dash_hazard_title: "Severe Mud-Loss Hazard in Tipam Sandstone within 32 Metres",
    dash_evidence_prefix: "Historical Offset Evidence:",
    dash_evidence_text: "sustained complete dynamic losses here (average 38 m³ lost to natural fractures). Sensor telemetry indicates flow-out deficit (-32 LPM) and ECD climbing towards 1.33 sg.",
    dash_offset_count: "4 of {count} offset wells within 10km radius (DIK-04, DIK-02, DIK-07, DIK-11)",
    dash_rag_remedial_title: "RAG Verified Remedial Action (Source: WCR-DIK-04, p.14):",
    dash_remedial_1: "Pre-treat active system with 25-30 ppb coarse LCM pill (nut-plug + mica) before reaching 2,300m depth.",
    dash_remedial_2: "Reduce pump flow rate by 10-15% to cap ECD strictly below 1.28 sg.",
    dash_btn_inspect_curtain: "Inspect Offset Curtain",
    dash_btn_launch_replay: "Launch Drilling Replay",
    dash_modules_header: "Core Institutional Memory Modules",
    dash_mod_map_desc: "PostGIS spatial query engine calculating offset similarity scores (S) in 3.85ms, with 3D trajectories and detailed well dossiers.",
    dash_mod_curtain_desc: "Dynamic multi-track formation log correlation stretching offset wells to active well stratigraphy with look-ahead hazard ribbons.",
    dash_mod_copilot_desc: "Semantic intelligence engine answering drilling queries with 100% sentence-level source citations and zero-hallucination policy.",

    // Map Specific
    map_title: "Upper Assam Basin Proximity",
    map_active_label: "Active:",
    map_field_label: "Field:",
    map_search_radius: "km search radius"
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
    languageToggle: "पोर्टल की भाषा बदलें",

    // Dashboard (Command Center)
    dash_title: "रिग कमांड सेंटर • रीयल-टाइम निर्णय समर्थन",
    dash_subtitle: "ऑयल इंडिया लिमिटेड • ई-आरटीमैक प्रवाह एकीकरण • ऊपरी असम बेसिन ड्रिलिंग परिचालन",
    dash_live_feed: "लाइव रिग फ़ीड: सक्रिय (1.2 सेकंड अंतराल)",
    dash_kpi_wells: "इंडेक्स किए गए ऑफ़सेट कूप",
    dash_kpi_wells_val: "60 कूप",
    dash_kpi_wells_sub: "100% पोस्टजीआईएस भू-कोडित",
    dash_kpi_npt: "ट्रैक किया गया ऐतिहासिक एनपीटी",
    dash_kpi_npt_sub: "47 डब्ल्यूसीआर/डीडीआर रिपोर्टों से विश्लेषित",
    dash_kpi_npt_unit: "घंटे",
    dash_kpi_cost: "अनुमानित लागत बचत",
    dash_kpi_cost_sub: "1 स्टक पाइप या किक घटना की रोकथाम",
    dash_kpi_doc_ai: "दस्तावेज़ एआई निष्कर्षण",
    dash_kpi_doc_ai_sub: "100% जमीनी सत्य सटीकता",
    dash_lookahead_badge: "सक्रिय लुक-अहेड चेतावनी",
    dash_lookahead_sub: "सक्रिय बिट @ 2,268 मी. एमडी • आगामी खतरा क्षेत्र: 2,300 मी. - 2,345 मी.",
    dash_hazard_title: "32 मीटर के भीतर टिपम सैंडस्टोन में गंभीर मड-लॉस (कीचड़ रिसाव) का खतरा",
    dash_evidence_prefix: "ऐतिहासिक ऑफ़सेट साक्ष्य:",
    dash_evidence_text: "में पूर्ण गतिशील रिसाव हुआ था (प्राकृतिक दरारों में औसतन 38 घन मीटर नुकसान)। सेंसर टेलीमेट्री प्रवाह घाटा (-32 एलपीएम) और ईसीडी 1.33 एसजी की ओर बढ़ने का संकेत दे रही है।",
    dash_offset_count: "10 किमी दायरे में {count} में से 4 ऑफ़सेट कूपों (DIK-04, DIK-02, DIK-07, DIK-11)",
    dash_rag_remedial_title: "आरएजी सत्यापित उपचारात्मक कार्रवाई (स्रोत: WCR-DIK-04, पृष्ठ 14):",
    dash_remedial_1: "2,300 मीटर गहराई तक पहुंचने से पहले सक्रिय प्रणाली में 25-30 पीपीबी मोटे एलसीएम पिल (नट-प्लग + अभ्रक) डालें।",
    dash_remedial_2: "ईसीडी को 1.28 एसजी से नीचे रखने के लिए पंप प्रवाह दर को 10-15% कम करें।",
    dash_btn_inspect_curtain: "ऑफ़सेट कर्टेन निरीक्षण",
    dash_btn_launch_replay: "ड्रिलिंग रीप्ले शुरू करें",
    dash_modules_header: "प्रमुख संस्थागत स्मृति मॉड्यूल",
    dash_mod_map_desc: "पोस्टजीआईएस स्थानिक क्वेरी इंजन जो 3.85 मिलीसेकंड में ऑफ़सेट समानता स्कोर की गणना करता है, 3D प्रक्षेपवक्र और विस्तृत कूप डॉसियर के साथ।",
    dash_mod_curtain_desc: "लुक-अहेड खतरा रिबन के साथ सक्रिय कूप स्तरिकी के अनुसार ऑफ़सेट कूपों को संरेखित करने वाला गतिशील बहु-ट्रैक फॉर्मेशन लॉग सहसंबंध।",
    dash_mod_copilot_desc: "100% वाक्य-स्तरीय स्रोत उद्धरणों और शून्य-भ्रांति नीति के साथ ड्रिलिंग प्रश्नों का उत्तर देने वाला सिमेंटिक इंटेलिजेंस इंजन।",

    // Map Specific
    map_title: "ऊपरी असम बेसिन कूप सामीप्य",
    map_active_label: "सक्रिय:",
    map_field_label: "क्षेत्र:",
    map_search_radius: "किमी खोज दायरा"
  }
};

export function useTranslation() {
  const language = useWellStore((state) => state.language) || "en";
  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };
  return { t, language };
}
