import re
import json

VALID_EVENT_TYPES = ["LOSS", "KICK", "STUCK", "TORQUE_DRAG", "CEMENT_ISSUE", "WELLBORE_INSTABILITY"]
VALID_FORMATIONS = [
    "Alluvium", "Dhekiajuli Sandstone", "Girujan Clay", "Tipam Sandstone",
    "Surma Group", "Barail Coal-Shale", "Kopili Shale", "Jaintia Limestone"
]

def extract_events_from_text(text, doc_id="DOC-UNKNOWN", well_id="WELL-UNKNOWN", page=1):
    events = []
    
    # 1. Depth interval
    depth_match = re.search(r"DEPTH INTERVAL:\s*([0-9.]+)\s*m\s*to\s*([0-9.]+)\s*m", text)
    md_from = float(depth_match.group(1)) if depth_match else None
    md_to = float(depth_match.group(2)) if depth_match else None
    
    # 2. Formation
    form_match = re.search(r"FORMATION:\s*([^\r\n]+)", text)
    formation = form_match.group(1).strip() if form_match else None
    
    # 3. Incident classification
    type_match = re.search(r"INCIDENT CLASSIFICATION:\s*([A-Z_]+)", text)
    event_type = type_match.group(1).strip() if type_match else None
    
    # 4. Severity
    sev_match = re.search(r"SEVERITY:\s*([A-Z_]+)", text)
    severity = sev_match.group(1).strip() if sev_match else "MEDIUM"
    
    # 5. NPT
    npt_match = re.search(r"NPT RECORDED:\s*([0-9.]+)\s*hours", text)
    npt_h = float(npt_match.group(1)) if npt_match else 0.0
    
    # 6. Mud properties
    mw_match = re.search(r"Mud Weight:\s*([0-9.]+)\s*sg", text)
    mud_wt = float(mw_match.group(1)) if mw_match else 1.25
    
    vol_match = re.search(r"Volume Lost / Gained:\s*([0-9.]+)\s*m3", text)
    vol_lost = float(vol_match.group(1)) if vol_match else 0.0
    
    # 7. Narrative causes and mitigations
    cause_match = re.search(r"INCIDENT SUMMARY & ROOT CAUSE:\s*\n([^\r\n]+)", text)
    cause = cause_match.group(1).strip() if cause_match else ""
    
    mit_match = re.search(r"REMEDIAL ACTIONS / MITIGATION PUMPED:\s*\n([^\r\n]+)", text)
    mitigation = mit_match.group(1).strip() if mit_match else ""
    
    out_match = re.search(r"FINAL OUTCOME & LESSONS LEARNED:\s*\n([^\r\n]+)", text)
    outcome = out_match.group(1).strip() if out_match else ""
    
    evidence_quote = f"At depth {md_from}m in {formation}, {cause}. Action taken: {mitigation}"
    
    # Confidence validation gates
    checks_passed = 0
    if event_type in VALID_EVENT_TYPES:
        checks_passed += 1
    if md_from is not None and md_to is not None and md_from <= md_to:
        checks_passed += 1
    if formation and any(f.lower() in formation.lower() for f in VALID_FORMATIONS):
        checks_passed += 1
    if len(cause) > 5:
        checks_passed += 1
    if len(mitigation) > 5:
        checks_passed += 1
        
    confidence = round(0.50 + (checks_passed / 5.0) * 0.45, 2)
    needs_review = confidence < 0.75
    
    if event_type and md_from is not None:
        events.append({
            "event_id": f"EXT-{doc_id[:10]}-{int(md_from)}",
            "doc_id": doc_id,
            "well_id": well_id,
            "page": page,
            "type": event_type,
            "md_from": md_from,
            "md_to": md_to,
            "formation": formation,
            "severity": severity,
            "mud_wt_sg": mud_wt,
            "volume_lost_m3": vol_lost,
            "npt_hours": npt_h,
            "cause": cause,
            "mitigation": mitigation,
            "outcome": outcome,
            "evidence_quote": evidence_quote,
            "confidence": confidence,
            "needs_review": needs_review,
            "verified": not needs_review
        })
    return events
