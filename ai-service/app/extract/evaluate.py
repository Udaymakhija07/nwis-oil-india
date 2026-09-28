import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from schema_extractor import extract_events_from_text

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent.parent
docs_dir = ROOT / "data-gen/synthetic_docs"
gt_path = ROOT / "data-gen/ground_truth.json"

with open(gt_path) as f:
    ground_truth = json.load(f)

print(f"Benchmarking Document AI Pipeline against {len(ground_truth)} ground-truth records...")

metrics = {
    "type": {"tp": 0, "fp": 0, "fn": 0},
    "depth": {"tp": 0, "fp": 0, "fn": 0},
    "formation": {"tp": 0, "fp": 0, "fn": 0},
    "severity": {"tp": 0, "fp": 0, "fn": 0},
    "mud_wt": {"tp": 0, "fp": 0, "fn": 0}
}

total_confidence = 0.0
extracted_count = 0
review_queue_count = 0

for item in ground_truth:
    doc_id = item["doc_id"]
    txt_file = docs_dir / doc_id.replace(".pdf", ".txt")
    if not txt_file.exists():
        continue
        
    text = txt_file.read_text()
    extracted = extract_events_from_text(text, doc_id=doc_id, well_id=item["well_id"], page=item["page"])
    gt_event = item["ground_truth_event"]
    
    if not extracted:
        for k in metrics:
            metrics[k]["fn"] += 1
        continue
        
    ext = extracted[0]
    extracted_count += 1
    total_confidence += ext["confidence"]
    if ext["needs_review"]:
        review_queue_count += 1
        
    # Check Type
    if ext["type"] == gt_event["type"]:
        metrics["type"]["tp"] += 1
    else:
        metrics["type"]["fp"] += 1
        
    # Check Depth (within 1 metre tolerance)
    if abs(ext["md_from"] - gt_event["md_from"]) <= 1.0 and abs(ext["md_to"] - gt_event["md_to"]) <= 1.0:
        metrics["depth"]["tp"] += 1
    else:
        metrics["depth"]["fp"] += 1
        
    # Check Formation
    if ext["formation"].lower() == gt_event["formation"].lower():
        metrics["formation"]["tp"] += 1
    else:
        metrics["formation"]["fp"] += 1
        
    # Check Severity
    if ext["severity"] == gt_event["severity"]:
        metrics["severity"]["tp"] += 1
    else:
        metrics["severity"]["fp"] += 1
        
    # Check Mud Weight (within 0.02 tolerance)
    if abs(ext["mud_wt_sg"] - gt_event["mud_wt_sg"]) <= 0.02:
        metrics["mud_wt"]["tp"] += 1
    else:
        metrics["mud_wt"]["fp"] += 1

print("-" * 55)
print("Field          | Precision  | Recall     | F1-Score  ")
print("-" * 55)

f1_scores = []
for field, counts in metrics.items():
    tp = counts["tp"]
    fp = counts["fp"]
    fn = counts["fn"]
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    f1_scores.append(f1)
    print(f"{field:<14} | {precision:<10.3f} | {recall:<10.3f} | {f1:<10.3f}")

overall_f1 = sum(f1_scores) / len(f1_scores)
avg_conf = total_confidence / extracted_count if extracted_count > 0 else 0.0

print("=" * 55)
print(f"Overall Field-Level F1 Score:  {overall_f1:.3f} (SLA >= 0.85)")
print(f"Average Extraction Confidence: {avg_conf:.3f}")
print(f"Total Processed Documents:     {extracted_count}/{len(ground_truth)}")
print(f"Review Queue Backlog:          {review_queue_count} items")
print("=" * 55)
