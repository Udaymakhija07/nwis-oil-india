import React, { useState } from "react";
import { Search, Send, Sparkles, FileText, CheckCircle2, ShieldAlert, AlertCircle, ExternalLink } from "lucide-react";
import { useWellStore } from "../store/useWellStore";

export default function Copilot() {
  const { activeWellId } = useWellStore();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: `Hello, I am NWIS Copilot — your AI drilling assistant with institutional memory for Oil India Limited. Ask me anything about offset well experiences, mud losses, stuck pipe mitigations, or casing designs in the ${activeWellId} area. Every recommendation is strictly grounded in verified WCR and DDR reports.`,
      citations: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [inspectingQuote, setInspectingQuote] = useState(null);

  const suggestedQuestions = [
    "What LCM recipe worked best for mud losses in Tipam Sandstone?",
    "What mud weight was used through Barail in nearby wells and did kicks occur?",
    "How was pipe freed during stuck incidents in Kopili Shale?",
    "How to fix lunar orbiter engine? (Zero-hallucination refusal test)"
  ];

  const handleAsk = async (qText) => {
    const query = qText || question;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5050/api/copilot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query, active_well_id: activeWellId, radius_km: 10.0 })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            text: data.answer,
            has_evidence: data.has_evidence,
            citations: data.citations || []
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", text: "Error communicating with NWIS Copilot service.", citations: [] }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Backend service unreachable.", citations: [] }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 p-8 space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            RAG Copilot • "Ask NWIS" Institutional Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Zero-Hallucination Institutional Memory Engine with sentence-level WCR/DDR document citations.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Strict Citation Policy Active</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Try asking:</span>
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleAsk(sq)}
            className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-amber-800 hover:border-amber-300 text-xs whitespace-nowrap transition-all shadow-xs font-medium"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Messages Thread - Clean Light Surface */}
      <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-2xl p-5 rounded-2xl text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-800 shadow-xs"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>

              {/* Citations Badges */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-200 space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Verified Source Citations:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {m.citations.map((c, ci) => (
                      <button
                        key={ci}
                        onClick={() => setInspectingQuote(c)}
                        className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>[{c.well_id}, {c.doc_id}, p.{c.page}]</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2.5 text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>Retrieving historical offset well evidence & verifying quotes...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Ask a drilling question about nearby offset wells (e.g. mud weight, LCM, stuck pipe)..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          className="flex-1 px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading}
          className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Citation Popover Modal */}
      {inspectingQuote && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-900">Verified Evidence Quote</span>
              <button onClick={() => setInspectingQuote(null)} className="text-slate-400 hover:text-slate-800 text-xs font-bold px-2 py-1 rounded-lg bg-slate-100">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500 text-[11px] font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span>Doc: <strong className="text-slate-900">{inspectingQuote.doc_id}</strong></span>
                <span>Page: <strong className="text-amber-700 font-bold">{inspectingQuote.page}</strong></span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 leading-relaxed italic">
                "{inspectingQuote.quote}"
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                <strong>Remedial Action:</strong> {inspectingQuote.mitigation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
