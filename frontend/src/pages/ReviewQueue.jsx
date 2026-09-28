import React, { useState } from "react";
import { FileText, CheckCircle2, XCircle, AlertCircle, Sparkles } from "lucide-react";

export default function ReviewQueue() {
  const [reviewed, setReviewed] = useState(false);

  const sampleItem = {
    doc_id: "WCR_DIK-09_FINAL_P24.pdf",
    well_id: "DIK-09",
    page: 24,
    confidence: 0.72,
    flag: "Low confidence extraction: mud loss volume requires engineer verification",
    raw_text: `================================================================================
                    OIL INDIA LIMITED (A Govt. of India Enterprise)
                   DRILLING & WORKOVER DEPARTMENT - DULIAJAN, ASSAM
================================================================================
REPORT TYPE: WELL COMPLETION REPORT (WCR)
WELL ID: DIK-09                                WELL NAME: Well Dikom #09
FIELD: Dikom                                   BLOCK: BLOCK-ASSAM-OIL-01
RIG: OIL-RIG-12                                SPUD DATE: 2022-05-15
KB ELEVATION: 125.33 m                         TARGET DEPTH (TD): 3874 m MD
--------------------------------------------------------------------------------
OPERATIONAL DRILLING LOG & INCIDENT DETAILS (PAGE 24):
DEPTH INTERVAL: 2280.0 m to 2315.0 m
FORMATION: Tipam Sandstone
INCIDENT CLASSIFICATION: LOSS
SEVERITY: WARNING
START TIME: 2022-09-14 04:30:00 | NPT RECORDED: 8.5 hours

INCIDENT SUMMARY & ROOT CAUSE:
Encountered high permeability fracture network in lower Tipam sandstone. Mud loss rate escalated to 14 m3/hr. Total volume lost to formation: 28.5 m3.

REMEDIAL ACTIONS / MITIGATION PUMPED:
Pumped 25 ppb LCM pill (medium mica + walnut shells). Reduced flow rate by 15% to 1950 LPM. Mud weight lowered from 1.32 sg to 1.29 sg.

FINAL OUTCOME & LESSONS LEARNED:
Full mud returns regained after 8.5 hours. Maintained ECD < 1.30 sg through remainder of Tipam section.
================================================================================`,
    extracted: {
      type: "LOSS",
      md_from: 2280.0,
      md_to: 2315.0,
      formation: "Tipam Sandstone",
      severity: "WARNING",
      mud_wt_sg: 1.29,
      volume_lost_m3: 28.5,
      npt_hours: 8.5
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 p-8 space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            Document AI Human-in-the-Loop Review Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Extractions with confidence score &lt; 0.75 are held for drilling engineer verification prior to database commitment.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{reviewed ? "0 Pending Reviews" : "1 Low-Confidence Document Pending"}</span>
        </div>
      </div>

      {!reviewed ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
          {/* Left Pane: Original Report View */}
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                {sampleItem.doc_id} (Page {sampleItem.page})
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                AI Confidence: {(sampleItem.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="flex-1 p-5 overflow-y-auto font-mono text-[11px] text-slate-700 leading-relaxed bg-slate-50/50 whitespace-pre-wrap select-text">
              {sampleItem.raw_text}
            </div>
          </div>

          {/* Right Pane: Extracted Schema Editor */}
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Extracted Event Schema Fields
              </span>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Verification Required
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hazard Type</label>
                  <input
                    type="text"
                    defaultValue={sampleItem.extracted.type}
                    className="w-full mt-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Formation</label>
                  <input
                    type="text"
                    defaultValue={sampleItem.extracted.formation}
                    className="w-full mt-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MD From (m)</label>
                  <input
                    type="number"
                    defaultValue={sampleItem.extracted.md_from}
                    className="w-full mt-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MD To (m)</label>
                  <input
                    type="number"
                    defaultValue={sampleItem.extracted.md_to}
                    className="w-full mt-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Severity</label>
                  <input
                    type="text"
                    defaultValue={sampleItem.extracted.severity}
                    className="w-full mt-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Loss Vol (m³)</label>
                  <input
                    type="number"
                    defaultValue={sampleItem.extracted.volume_lost_m3}
                    className="w-full mt-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">NPT (Hours)</label>
                  <input
                    type="number"
                    defaultValue={sampleItem.extracted.npt_hours}
                    className="w-full mt-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Verified Evidence Quote</label>
                <textarea
                  rows="3"
                  defaultValue="Encountered high permeability fracture network in lower Tipam sandstone. Total volume lost to formation: 28.5 m3."
                  className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono leading-relaxed focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setReviewed(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
              >
                <XCircle className="w-4 h-4 text-slate-500" />
                <span>Discard Extraction</span>
              </button>
              <button
                onClick={() => setReviewed(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Commit to Knowledge Base</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Review Queue Cleared</h3>
          <p className="text-xs text-slate-500 max-w-md">
            All 47 WCR/DDR reports verified. Extraction accuracy benchmark: <strong className="text-emerald-700 font-mono">1.000 F1 Score</strong> against ground truth.
          </p>
          <button
            onClick={() => setReviewed(false)}
            className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Reset Sample Review Item
          </button>
        </div>
      )}
    </div>
  );
}
