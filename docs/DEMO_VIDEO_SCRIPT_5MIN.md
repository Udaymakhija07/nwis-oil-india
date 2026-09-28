# 🎥 NWIS: 5-Minute YouTube Demo Video — Master Script & Screen Action Guide

**Project:** Nearby Wells Intelligence System (NWIS)  
**Organization:** Oil India Limited (eRTMAC Duliajan Headquarters)  
**Competition:** Smart India Hackathon (SIH 2026) | Problem Statement ID: `26121`  
**Target Duration:** Exactly 5 Minutes (00:00 – 05:00)  
**Format:**
- 🎙️ **Spoken Voiceover Script:** **100% Professional Fluent English** (Evaluator & Judge Ready).
- 🖱️ **Screen & Mouse Instructions:** **Hinglish** (Aapko screen par kab, kahan click karna hai aur kya change karke live dikhana hai).

---

## ⏱️ Video Timeline at a Glance

| Segment | Timestamp | Module / Screen | Live Demo Action |
| :--- | :--- | :--- | :--- |
| **1. Hook & Overview** | `00:00 - 00:40` | Top Navbar & Command Center | Top metrics hover, official Oil India & Ministry branding |
| **2. PostGIS Spatial Engine** | `00:40 - 01:25` | Well Proximity Map | **Live Slider drag (10km -> 25km)**, Focus switch, Well Pin click |
| **3. Offset Curtain (Hero)** | `01:25 - 02:05` | Offset Curtain | Vertical multi-track scroll, Depth log correlation, Hazard callout |
| **4. Predictive ML & SHAP** | `02:05 - 02:50` | Look-Ahead Radar | 3 Risk gauges, **SHAP Feature Importance hover**, AI Mitigations |
| **5. RAG Copilot & Doc AI** | `02:50 - 03:40` | RAG Copilot & Review Queue | **Live Preset Query**, **Click Citation Modal**, **Live AI Extract (118ms)** |
| **6. Live eRTMAC Simulator** | `03:40 - 04:25` | Drilling Simulator | **Click "Start Real-Time Stream"**, **Trigger 42m Look-Ahead Alert** |
| **7. Pre-Spud Dossier & Wrap**| `04:25 - 05:00` | Pre-Spud Offset Brief | **Print / Export PDF Preview**, Production Architecture Wrap-up |

---

## 🎬 Detailed Second-by-Second Walkthrough

---

### ⏱️ Segment 1: Hook, Problem Statement & Architecture (`00:00` - `00:40`)

#### 🖱️ Screen Recording Action (Hinglish Guide):
1. **At `00:00`:** Safari/Chrome ko full-screen me rakhein on `http://localhost:5173`. Screen par **Command Center** open hona chahiye.
2. Mouse cursor ko top navbar par le jayein:
   - **Official Oil India Limited Logo** aur **"भारत सरकार / Ministry of Petroleum & Natural Gas"** title ko cursor se highlight karein.
   - Right side me **"eRTMAC: CONNECTED"** (pulsing green dot) aur **Live IST Clock** dikhayein.
3. Mouse ko neeche laakar 4 main Metric Cards par hover karein:
   - `60 Total Wells` (Dikom, Nahorkatiya, Moran)
   - `21 In-Radius Offsets`
   - `3.85 ms PostGIS Latency`
   - `99.8% AI Extraction Accuracy`
4. Screen ke right side me **Risk Gauge** aur **Formation Tops Prognosis** bar par cursor smoothly move karein.

#### 🎙️ Spoken Script (English — Speak Clearly and Confidently):
> *"Welcome evaluators. Today, I am presenting the **Nearby Wells Intelligence System (NWIS)**, developed for **Oil India Limited** under **Smart India Hackathon 2026, Problem Statement ID 26121**.*
> 
> *In the complex thrust-fault geologies of the Upper Assam Basin, unexpected geohazards like stuck pipe and severe mud loss cost Oil India crores of rupees annually in Non-Productive Time (NPT). NWIS is an end-to-end, enterprise subsurface intelligence platform built to empower eRTMAC Duliajan with real-time offset well data, predictive risk modeling, and instant geohazard mitigation.*
> 
> *Let us explore the core capabilities of the platform live."*

---

### ⏱️ Segment 2: PostGIS Proximity Engine & 3D Well Map (`00:40` - `01:25`)

#### 🖱️ Screen Recording Action (Hinglish Guide):
1. **At `00:40`:** Left sidebar me **"Well Proximity Map"** par click karein.
2. Upper Assam Basin ke 60 wells canvas par load honge with 3 geological fields: Dikom, Nahorkatiya, aur Moran.
3. **🔴 LIVE INTERACTIVE CHANGE #1 (Focus Switch):**
   - Top bar me Focus selector me **"Dikom"** button par click karein! Map smoothly zoom hokar Dikom Block par focus karega.
4. **🔴 LIVE INTERACTIVE CHANGE #2 (Radius Slider Drag):**
   - Top control bar me **Radius Slider** ko `10 km` se right drag karke **`25 km`** karein!
   - Viewers ko dikhega ki amber radar circle live expand ho raha hai aur bottom toolbar me offsets count instantly update ho raha hai (`In Radius: 21 Offsets -> 38 Offsets`).
5. **🔴 LIVE INTERACTIVE CHANGE #3 (Click on a Well Marker):**
   - Active well `DIK-14` ke paas kisi bhi green marker (`DIK-18` ya `DIK-02`) par click karein.
   - Notice karein ki marker dot bilkul apni jagah par rehta hai (no displacement bug) aur right side me **"Well Dossier Drawer"** smoothly open ho jata hai with exact depths, formation tops, and historical incidents!

#### 🎙️ Spoken Script (English):
> *"Our first module is the **Spatial Proximity Engine**. Here, we visualize 60 exploratory and development wells across the Upper Assam Basin.*
> 
> *Against the industry SLA of 300 milliseconds, our PostGIS spatial indexing engine calculates proximity in just **3.85 milliseconds**.*
> 
> *As I adjust the search radius from 10 kilometers to 25 kilometers, our proprietary **Offset Similarity Score ($S$)** dynamically ranks nearby wells using spatial distance, structural TVD dip, and stratigraphy. Green markers indicate high-confidence offset analogs with similarity scores above 80%. Clicking on offset **DIK-18** instantly retrieves its complete subsurface dossier, directional profile, and past drilling events."*

---

### ⏱️ Segment 3: Multi-Track Offset Curtain (`01:25` - `02:05`)

#### 🖱️ Screen Recording Action (Hinglish Guide):
1. **At `01:25`:** Sidebar me **"Offset Curtain"** (Hero View) par click karein.
2. Vertical multi-track well-log correlation canvas load hoga (isme 0m se 4000m depth puri screen me fitted hai, scroll karne ki zaroorat nahi hai).
3. **🔴 LIVE INTERACTIVE CHANGE #4 (Add/Remove Offset Track):**
   - Top-right corner me **"Select Offsets:"** ke aage jo buttons hain (`DIK-04`, `DIK-02`, `DIK-07`, `DIK-09`), unme se **`DIK-09`** par click karein!
   - Screen par live ek naya offset track smoothly add ho jayega!
4. **🔴 LIVE INTERACTIVE CHANGE #5 (Click Historical Incident Badge):**
   - Kisi bhi track par jo red color ka **"LOSS"** ya amber color ka **"KICK"** ka badge dikh raha hai (jaise `DIK-04` par), **us badge par click karein!**
   - Screen par instant ek **"Historical Event Modal"** popup open hoga, jisme:
     - Root cause (*"Loss circulation 18 m³/hr in Tipam"*)
     - NPT lost hours (*"14 hrs"*)
     - Mitigation taken (*"Spotted 25 ppb mica LCM pill"*)
   - Modal ko **"✕"** dabakar close karein.
5. Center track me red line (`Active Bit: 2268m MD`) ke theek neeche jo striped warning box hai (*"Projected Mud Loss Hazard"*), us par cursor le jayein.

#### 🎙️ Spoken Script (English):
> *"Next is our hero visualization feature: **The Offset Curtain**.*
> 
> *Subsurface teams often struggle with static correlation tables. We engineered a dynamic, depth-synchronized vertical multi-track canvas that correlates planned well trajectories alongside highest-ranked offset logs.*
> 
> *Notice how effortlessly we can toggle offset wells like DIK-09 to dynamically compare lithological columns. Clicking directly on this red LOSS event badge at 2,310 meters opens the historical incident breakdown, revealing that the offset well suffered 14 hours of NPT due to severe circulation loss in the Tipam formation.*
> 
> *Directly beneath our active bit at 2,268 meters, the platform highlights the projected geohazard zone ahead, enabling drilling superintendents to proactively design casing seats and mud density before spudding."*


---

### ⏱️ Segment 4: Predictive ML Risk Radar & SHAP (`02:05` - `02:50`)

#### 🖱️ Screen Recording Action (Hinglish Guide):
1. **At `02:05`:** Sidebar me **"Look-Ahead Radar"** (ML Risk) par click karein.
2. Screen par 3 risk dials display honge:
   - **Stuck Pipe Risk:** `84.2% (CRITICAL)` (red dial)
   - **Lost Circulation Risk:** `68.5% (HIGH)` (amber dial)
   - **Well Control / Kick:** `24.1% (LOW)` (green dial)
3. **🔴 LIVE INTERACTIVE CHANGE #5 (SHAP Drivers Hover):**
   - Mouse cursor ko **SHAP Top-3 Feature Drivers** bar chart par le jayein:
     - Driver 1: `Mud Weight Underbalance (-0.08 SG)` -> `+42%` impact
     - Driver 2: `Differential Overpressure in Girujan` -> `+28%` impact
     - Driver 3: `Dogleg Severity (> 3.8°/30m)` -> `+14%` impact
4. Screen ke bottom me **AI Recommended Mitigations** card dikhayein (*"Increase mud weight to 1.28 SG, reduce ROP to 6 m/hr"*).

#### 🎙️ Spoken Script (English):
> *"Moving to our **Predictive AI and Machine Learning Engine**.*
> 
> *NWIS does not merely display historical logs — it forecasts upcoming geohazards. Our ensemble models predict probabilities for Stuck Pipe, Lost Circulation, and Well Control events.*
> 
> *Most importantly, we maintain a strict **Zero Black-Box AI policy**. Using **SHAP (Shapley Additive Explanations)**, every prediction is fully explainable. The system reveals that the 84% Stuck Pipe risk is primarily driven by mud weight underbalance and high dogleg severity. Alongside the risk score, the model immediately recommends operational mitigations, such as raising mud weight to 1.28 specific gravity and reducing rate of penetration."*

---

### ⏱️ Segment 5: Zero-Hallucination RAG Copilot & Document AI (`02:50` - `03:40`)

#### 🖱️ Screen Recording Action (Hinglish Guide):
1. **At `02:50`:** Sidebar me **"RAG Copilot (Ask NWIS)"** par click karein.
2. **🔴 LIVE INTERACTIVE CHANGE #6 (Run Preset AI Query):**
   - Chat input ke upar jo preset chip hai: *"What geohazards were encountered in the Barail formation of DIK-02?"* uspar click karein!
   - 1-2 seconds me AI answer stream hoga with technical mud weight and formation tops.
3. **🔴 LIVE INTERACTIVE CHANGE #7 (Click Source Citation Badge):**
   - Generated answer ke neeche sentence-level citation badge **`[DIK-02, WCR_1998, Page 14]`** par click karein!
   - Screen par **"Verified Source Citation Modal"** popup open hoga, jisme exact OCR sentence quote, page number, aur 98% extraction confidence dikhega. "Close Citation" dabayein.
4. **🔴 LIVE INTERACTIVE CHANGE #8 (Document AI Playground & Benchmark):**
   - Sidebar me **"Document AI Review"** par click karein.
   - Tab 2 **"Live AI Extractor"** par click karein aur **"Extract Geohazard Entities"** dabayein — 118ms me structured JSON output live extract hoga!
   - Tab 3 **"Benchmark Metrics"** par click karein — Table me **F1-Score = 1.000**, Precision = 1.000 dikhayein!

#### 🎙️ Spoken Script (English):
> *"In safety-critical drilling operations, AI hallucinations can cause catastrophic blowouts. Therefore, our **RAG Copilot** enforces strict, verifiable sentence-level provenance.*
> 
> *When querying historical hazards in the Barail formation, the copilot semantically searches across 47 Well Completion and Daily Drilling reports. Clicking directly on the citation badge opens the verified evidence modal, displaying the exact OCR quote, source document ID, page number, and confidence score.*
> 
> *Powering this is our **Document AI Pipeline**, benchmarked on 47 ground-truth reports with a **perfect 1.000 F1-score**, converting unstructured scanned PDFs into structured geohazard JSON in just 118 milliseconds."*

---

### ⏱️ Segment 6: eRTMAC Live Telemetry Simulator (`03:40` - `04:25`)

#### 🖱️ Screen Recording Action (Hinglish Guide):
1. **At `03:40`:** Sidebar me **"Drilling Simulator"** (Live Stream) par click karein.
2. **🔴 LIVE INTERACTIVE CHANGE #9 (Start Real-Time WITSML Stream):**
   - Top right me green button **"Start Real-Time Stream"** par click karein!
   - Bit Depth counter fast count hona shuru karega: `3,180m -> 3,195m -> 3,208m MD`.
   - ROP, WOB, Torque, aur Standpipe Pressure ke gauges animated needle ke saath fluctuate honge.
3. **🔴 LIVE INTERACTIVE CHANGE #10 (Look-Ahead Alert Trigger):**
   - Jaise hi Bit Depth **`3,208m`** cross karegi, screen ke top par **Critical Warning Flash Banner** trigger hoga:
     *"LOOK-AHEAD ALERT: High Loss Zone at 3,250m MD (Lead Distance: 42m, Time-to-Reach: 2.6 hours)"*.
   - Mouse se banner ke andar **"Review Mitigations"** button par click karein.

#### 🎙️ Spoken Script (English):
> *"Now, let us examine our most dynamic capability: **The eRTMAC Live Telemetry Simulator**.*
> 
> *Here, we simulate real-time WITSML sensor streams arriving at Oil India's Duliajan real-time operations center. As I initiate the live stream, Bit Depth, ROP, Weight on Bit, and Torque advance dynamically.*
> 
> *Notice what happens as the bit crosses 3,208 meters: our **Look-Ahead Alert Engine** fires! With **42 meters of lead distance and 2.6 hours of lead time**, the platform warns the drilling superintendent of an imminent loss zone ahead. This allows the crew to condition mud and spot loss circulation material hours before the bit penetrates the hazardous formation."*

---

### ⏱️ Segment 7: Pre-Spud Dossier & Conclusion (`04:25` - `05:00`)

#### 🖱️ Screen Recording Action (Hinglish Guide):
1. **At `04:25`:** Sidebar me **"Pre-Spud Offset Brief"** par click karein.
2. Official Oil India branded **Pre-Spud Hazard Brief (PSHB)** document screen par load hoga:
   - Official header logo
   - Target Well DIK-14 summary table
   - Top-5 offset similarity matrix
   - Casing point recommendations
3. **🔴 LIVE INTERACTIVE CHANGE #11 (Print / PDF Preview):**
   - Top right me **"Print / Export PDF"** button par mouse le jayein aur click karein (print dialog open hoga, fir Cancel karke smooth return karein).
4. **At `04:45`:** Sidebar me wapas **"Command Center"** par click karein, aur cursor center me rakhein.

#### 🎙️ Spoken Script (English):
> *"Finally, instead of spending days manually compiling offset reports, our **Pre-Spud Offset Brief Generator** produces an AI-verified, print-ready Pre-Spud Hazard Brief in a single click.*
> 
> *To summarize our production engineering:*
> - *React 18 frontend with seamless single-navbar enterprise UX.*
> - *High-performance FastAPI microservice and sub-4ms PostGIS spatial queries.*
> - *Zero-downtime in-memory fallback, ensuring zero installation friction on evaluator systems.*
> 
> *NWIS transforms raw subsurface data into proactive, life-saving intelligence for Oil India Limited. Thank you!"*

---

## 🏆 Checklist for Recording

1. **Before Recording:**
   - Dev servers running: Frontend on `localhost:5173`, Backend on `5050`, AI service on `8000`.
   - Browser full-screen (`Cmd + Ctrl + F` on Mac) with zoom at 100% (`Cmd + 0`).
   - Clean desktop without distractions.
2. **Audio Setup:**
   - Test mic volume — ensure speech is crisp, clear, and without background fan noise.
3. **Pacing:**
   - Don't rush! Speak at a steady, authoritative pace. The script is calibrated for ~130 words per minute, exactly fitting the 5-minute limit.
