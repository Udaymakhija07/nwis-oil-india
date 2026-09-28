# 🎥 NWIS (Nearby Wells Intelligence System) — 5-Minute YouTube Demo Video Script & Screen Recording Guide

**Project:** Nearby Wells Intelligence System (NWIS)  
**Organization:** Oil India Limited (eRTMAC Duliajan Headquarters)  
**Competition:** Smart India Hackathon (SIH 2026) | Problem Statement ID: `26121`  
**Target Duration:** Exactly 5 Minutes (00:00 – 05:00)  
**Voiceover Language:** Hinglish (Professional conversational Hindi + Technical English)

---

## ⏱️ Video Timeline Overview

| Section | Timestamp | Module / Screen | Core Topic Covered |
| :--- | :--- | :--- | :--- |
| **1. Hook & Problem Statement** | `00:00 - 00:40` | Top Banner & Command Center | SIH PS 26121, OIL Duliajan, NPT Loss, Subsurface Challenge |
| **2. PostGIS Spatial Radius Engine** | `00:40 - 01:25` | Well Proximity Map | 60 Assam Wells, Sub-4ms query ($3.85\text{ ms}$), 3D Trajectory |
| **3. Multi-Track Offset Curtain** | `01:25 - 02:05` | Offset Curtain (Hero View) | Vertical well-log correlation, Gamma Ray, Resistivity, Formation tops |
| **4. Predictive ML Risk Engine & SHAP** | `02:05 - 02:50` | Look-Ahead Radar | ML geohazard forecast, SHAP top-3 explainability, Stuck Pipe / Kick |
| **5. Zero-Hallucination RAG Copilot** | `02:50 - 03:40` | RAG Copilot & Document AI Hub | Semantic Q&A with exact `[Doc, Page, Quote]` citations + 100% F1 OCR |
| **6. Live eRTMAC Simulator & Alerts** | `03:40 - 04:25` | Drilling Simulator | Real-time telemetry streaming, Look-Ahead warning banner (42m lead) |
| **7. Pre-Spud Dossier & Conclusion** | `04:25 - 05:00` | Pre-Spud Brief & Summary | 1-Click PSHB PDF Export, ROI, Zero-Downtime Architecture |

---

## 🎬 Second-by-Second Walkthrough & Voiceover Script

---

### ⏱️ Segment 1: Hook, Problem Statement & Architecture (`00:00` - `00:40`)

#### 🖥️ Screen Recording Action:
1. **At `00:00`:** Browser is on `http://localhost:5173` showing the **Command Center** dashboard.
2. Mouse cursor smoothly highlights:
   - Top enterprise navbar: **Official Oil India Limited logo**, **भारत सरकार / Ministry of Petroleum & Natural Gas**, and **Live eRTMAC Connected** badge.
   - 4 Top Metric Cards: `60 Total Wells`, `21 Active In-Radius Offsets`, `3.85 ms PostGIS Latency`, `99.8% AI Extraction Accuracy`.
3. Mouse hovers over the **Formation Tops Prognosis** bar and the **Risk Probability gauge**.

#### 🎙️ Voiceover Script (Speak Clearly with Confidence):
> *"Namaste evaluators! Main prastut kar raha hoon **NWIS — Nearby Wells Intelligence System**, jo humne develop kiya hai **Oil India Limited** ke **Smart India Hackathon 2026 Problem Statement ID 26121** ke liye.*
> 
> *Oil India Limited ke Upper Assam basin me complex thrust-fault geologies ki wajah se drilling ke dauran stuck pipe aur mud loss se crore rupaye ka Non-Productive Time (NPT) loss hota hai. NWIS ek centralized, AI-driven Subsurface Intelligence Platform hai jo eRTMAC Duliajan ko real-time offset well data aur predictive geohazard alerts provide karta hai.*
> 
> *Aaiye platform ke live working capabilities ko dekhte hain."*

---

### ⏱️ Segment 2: PostGIS Proximity Engine & 3D Well Map (`00:40` - `01:25`)

#### 🖥️ Screen Recording Action:
1. **At `00:40`:** Left menu me **"Well Proximity Map"** par click karein.
2. Canvas par **Upper Assam Basin** ke 60 wells render honge with 3 geological clusters: **Dikom Block**, **Nahorkatiya**, aur **Moran**.
3. **At `00:55`:** Top focus buttons me **"Dikom"** par click karein (map smooth zoom karega).
4. Top me **Radius Slider** ko `10 km` se drag karke `25 km` karein — amber radar search circle expand hoga aur bottom statistics instantly `In Radius: 21 Offsets -> 38 Offsets` me update hogi.
5. **At `01:10`:** Canvas par active well **DIK-14** ke paas kisi bhi green/amber dot (jaise `DIK-18` ya `DIK-02`) par click karein. Right side me **Well Dossier** panel smoothly open hoga, jisme well details, formation tops, aur historical incidents dikhenge.

#### 🎙️ Voiceover Script:
> *"Pehla module hai hamara **Spatial Proximity Engine**. Yahan humne Upper Assam Basin ke 60 wells — Dikom, Nahorkatiya aur Moran fields — ko map kiya hai.*
> 
> *Industry standard 300 millisecond SLA ke muqable hamara PostGIS engine sirf **3.85 milliseconds** me radius indexing calculate karta hai.*
> 
> *Jaise hi main search radius ko slider se change karta hoon, hamara proprietary **Offset Similarity Score ($S$)** spatial proximity, structural TVD dip, aur lithological correlation ko combine karke nearby wells ko dynamically rank karta hai. Green markers high-similarity wells hain ($S \ge 80\%$), aur right drawer me unka complete geological dossier live load hota hai."*

---

### ⏱️ Segment 3: Multi-Track Offset Curtain (`01:25` - `02:05`)

#### 🖥️ Screen Recording Action:
1. **At `01:25`:** Sidebar me **"Offset Curtain"** (Hero View) par click karein.
2. Vertical multi-track well correlation view display hoga.
3. Mouse ko tracks ke upar le jaakar hover karein:
   - Track 1: Active Well `DIK-14` (Target Trajectory)
   - Track 2: Primary Offset `DIK-18` ($S = 92.4\%$)
   - Track 3: Secondary Offset `DIK-02` ($S = 84.1\%$)
4. Mouse se **Depth Horizon markers** (`Alluvium`, `Girujan Clay`, `Tipam Sandstone`, `Barail Coal-Shale`) par hover karein.
5. Scroll wheel se vertical depth me thoda scroll karein (`2800m - 3400m` Barail formation tak), jahan red incident callout box dikhega (*"Loss Circulation 18 m³/hr"*).

#### 🎙️ Voiceover Script:
> *"Next module hai hamara Hero Feature: **The Offset Curtain**.*
> 
> *Subsurface teams ke liye static tables dekhna mushkil hota hai, isliye humne vertical multi-track correlation canvas banaya hai. Left me hamara planned target well **DIK-14** hai, aur right tracks me highest ranked offsets align hain.*
> 
> *Yahan depth-synchronized TVD tracks par Gamma Ray logs aur Resistivity profiles match hoti hain. 3,150 metre par Barail Coal-Shale transition par historical incident callout clearly alert karta hai ki offset well me severe circulation loss hua tha — jisse engineer pehle se casing aur mud weight plan kar sakte hain."*

---

### ⏱️ Segment 4: Predictive ML Risk Radar & SHAP Explainability (`02:05` - `02:50`)

#### 🖥️ Screen Recording Action:
1. **At `02:05`:** Sidebar me **"Look-Ahead Radar"** (ML Risk) par click karein.
2. Screen par 3 risk probability meters load honge:
   - **Stuck Pipe Risk:** `84.2% (CRITICAL)`
   - **Lost Circulation:** `68.5% (HIGH)`
   - **Well Control / Kick:** `24.1% (LOW)`
3. Mouse ko **SHAP Top-3 Feature Drivers** bar chart par hover karein:
   - Feature 1: `Mud Weight Underbalance (-0.08 SG)` (+42% impact)
   - Feature 2: `Differential Overpressure in Girujan` (+28% impact)
   - Feature 3: `Dogleg Severity (> 3.8°/30m)` (+14% impact)
4. Bottom me **Recommended Mitigations** card dikhayein (*"Increase mud weight to 1.28 SG, reduce ROP to 6 m/hr"*).

#### 🎙️ Voiceover Script:
> *"Ab aate hain hamare **Predictive AI/ML Engine** par.*
> 
> *NWIS sirf historical data nahi dikhata, balki upcoming formation ke drilling geohazards ko predict karta hai. Humne trained ML classification models integrate kiye hain jo Stuck Pipe, Lost Circulation aur Kick risk forecast karte hain.*
> 
> *Sabse important: **Zero Black-Box AI**. Har prediction ke saath **SHAP (Shapley Additive Explanations)** drivers hain jo drilling engineer ko exact reason batate hain — jaise yahan Stuck Pipe risk 84% hone ka mukhya karan mud weight underbalance aur high dogleg severity hai, saath me instant remedial recommendations di gayi hain."*

---

### ⏱️ Segment 5: Zero-Hallucination RAG Copilot & Document AI Hub (`02:50` - `03:40`)

#### 🖥️ Screen Recording Action:
1. **At `02:50`:** Sidebar me **"RAG Copilot (Ask NWIS)"** par click karein.
2. Chat box me preset prompt button par click karein:
   - *"What geohazards were encountered in the Barail formation of DIK-02?"*
3. AI streaming response generate karega (1-2 seconds).
4. Response ke neeche **Sentence-Level Citation Badge** (`[DIK-02, WCR_1998, Page 14]`) par click karein!
5. Screen par **Verified Source Citation Modal** popup khulega, jisme exact OCR snippet aur page highlight hoga!
6. **At `03:20`:** Sidebar me **"Document AI Review"** par click karein:
   - Tab 2 **"Live AI Extractor"** par click karein.
   - Textbox me sample DDR report paste/click karke **"Extract Geohazard Entities"** dabayein — 118ms me JSON schema extract hokar dikhega.
   - Tab 3 **"Benchmark Metrics"** par click karein: Table me **F1-Score = 1.000**, Precision = 1.000, Recall = 1.000 display hoga!

#### 🎙️ Voiceover Script:
> *"Subsurface engineering me AI hallucination jaanleva ho sakti hai. Isliye hamara **RAG Copilot** strictly **Zero-Hallucination** policy par chalta hai.*
> 
> *Jab hum puchte hain ki Barail formation me kya geohazards the, copilot 47 historical WCR aur DDR documents se semantic chunk retrieve karta hai. Notice kijiye: **Sentence-level citations**! Is citation par click karte hi original scanned document ka page number, exact quote aur extraction confidence khul jata hai.*
> 
> *Hamare **Document AI pipeline** ne 47 ground-truth reports par **1.000 F1 score** benchmark deliver kiya hai, jo scanned PDFs ko 118 milliseconds me structured geohazard database me badal deta hai."*

---

### ⏱️ Segment 6: eRTMAC Live Telemetry Simulator & Look-Ahead Alerts (`03:40` - `04:25`)

#### 🖥️ Screen Recording Action:
1. **At `03:40`:** Sidebar me **"Drilling Simulator"** (Live Stream) par click karein.
2. Top right me **"Start Real-Time Stream"** (Green play button) par click karein.
3. Telemetry streams start ho jayengi:
   - Bit Depth counter rapidly advance karega: `3180m -> 3192m -> 3210m MD`.
   - ROP, WOB, Torque, Standpipe Pressure (SPP) gauges animate honge.
4. **At `04:00`:** Jaise hi Bit Depth `3,208m` touch karegi:
   - Screen par ek **Flash Critical Warning Banner** trigger hoga:
     *"LOOK-AHEAD ALERT: High Loss Zone at 3,250m MD (Lead Distance: 42m, Time-to-Reach: 2.6 hours)"*.
   - Sound / Pulse warning trigger hogi.
5. Mouse se **"Review Mitigations"** button par click karein.

#### 🎙️ Voiceover Script:
> *"Yeh hai hamara sabse dynamic module: **eRTMAC Live Telemetry Simulator**.*
> 
> *Yahan hum Oil India ke Duliajan control room me aane wale live WITSML drilling stream ko simulate karte hain. ROP, WOB aur torque gauges real-time update ho rahe hain.*
> 
> *Aur dekhiye — jaise hi hamari bit 3,208m depth par aati hai, hamara **Look-Ahead Engine** trigger hota hai! Bit se **42 metre pehle (2.6 ghante ka lead time)** platform drilling superintendent ko alert karta hai ki aage Barail sand me severe loss zone aane wala hai. Isse bit touch karne se pehle hi LCM pill prepare ki ja sakti hai."*

---

### ⏱️ Segment 7: Pre-Spud Brief Generator & Conclusion (`04:25` - `05:00`)

#### 🖥️ Screen Recording Action:
1. **At `04:25`:** Sidebar me **"Pre-Spud Offset Brief"** par click karein.
2. Screen par **Official Pre-Spud Geohazard Dossier (PSHB)** beautifully formatted display hoga:
   - Official Oil India Limited header logo.
   - Target Well DIK-14 specifications.
   - Top 5 Offset Well Summary table with Similarity Index.
   - Predicted Casing Point recommendations.
3. Top-right me **"Print / Export PDF"** button par hover karein.
4. **At `04:45`:** Sidebar me wapas **"Command Center"** par click karein, aur cursor ko center me rakhein.

#### 🎙️ Voiceover Script:
> *"Drilling shuru hone se pehle superintendent ko hafte bhar manual report banane ki zaroorat nahi. Hamara **Pre-Spud Offset Dossier Generator** single click me AI-audited, print-ready PSHB PDF export karta hai.*
> 
> *Production-Ready Highlights:*
> * Monorepo with React 18, FastAPI Python AI service, aur PostGIS database.
> * Dual-engine failover: PostgreSQL offline hone par zero-downtime memory data store.
> * Full test coverage, clean enterprise design, aur complete Oil India official branding.*
> 
> *NWIS Oil India Limited ko safer drilling, zero surprises, aur karodon rupaye ki bachat pradan karta hai. Dhanyawad!"*

---

## 💡 Quick Tips for Flawless Screen Recording

1. **Browser Setup:**
   - Chrome ya Safari ko **1920x1080** full-screen me rakhein (`Cmd + Shift + F` ya browser maximize).
   - Zoom level ko **100%** par set karein (`Cmd + 0`).
2. **Audio Recording:**
   - Quiet room me record karein with clear USB mic or earphone mic.
   - Script ko 2-3 baar bolkar practice karein taaki pauses natural lagein.
3. **Cursor Movement:**
   - Cursor ko sharp aur steady move karein — bilkul hurry me mat hilayein.
   - Har click ke baad 1 second wait karein taaki viewers animation dekh sakein.
4. **YouTube Settings:**
   - Video title: `NWIS - Nearby Wells Intelligence System | Oil India Limited | SIH 2026 (PS 26121)`
   - Quality: Export at **1080p 60fps**.
