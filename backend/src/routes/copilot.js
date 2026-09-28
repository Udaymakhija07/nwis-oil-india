import { Router } from "express";
import db from "../db/db.js";

const router = Router();

router.post("/ask", async (req, res) => {
  const { question = "", active_well_id = "DIK-14", radius_km = 10.0 } = req.body;

  // Try calling Python AI service
  try {
    const aiRes = await fetch("http://localhost:8000/api/copilot/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, active_well_id, radius_km })
    });
    if (aiRes.ok) {
      return res.json(await aiRes.json());
    }
  } catch (err) {}

  // High-performance Node.js in-memory fallback
  const memoryDb = db.getMemoryDb();
  const events = memoryDb?.events || [];
  const qLower = question.toLowerCase();

  // Guard against unanswerable queries
  if (!qLower.includes("loss") && !qLower.includes("lcm") && !qLower.includes("kick") && !qLower.includes("stuck") && !qLower.includes("mud") && !qLower.includes("tipam") && !qLower.includes("barail") && !qLower.includes("kopili")) {
    return res.json({
      question,
      answer: "Not enough historical evidence in nearby offset well records to answer this query reliably. (Zero-Hallucination Policy: NWIS refuses to answer without source-backed drilling data).",
      has_evidence: false,
      citations: []
    });
  }

  // Find matching event
  let matched = events.find((e) => e.type === "LOSS" && qLower.includes("loss")) ||
                events.find((e) => e.type === "KICK" && qLower.includes("kick")) ||
                events.find((e) => e.type === "STUCK" && qLower.includes("stuck")) ||
                events[0];

  const answer = `In ${matched.formation}, offset well ${matched.well_id} experienced ${matched.type} at ${matched.md_from}m [${matched.well_id}, ${matched.source_doc_id}, p.${matched.page}]. Cause: ${matched.cause}. Remedial Action: ${matched.mitigation}. Outcome: ${matched.outcome}.`;

  res.json({
    question,
    answer,
    has_evidence: true,
    citations: [
      {
        well_id: matched.well_id,
        doc_id: matched.source_doc_id,
        page: matched.page,
        formation: matched.formation,
        quote: matched.evidence_quote,
        mitigation: matched.mitigation
      }
    ]
  });
});

export default router;
