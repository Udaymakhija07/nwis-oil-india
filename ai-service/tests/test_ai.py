import unittest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app.extract.schema_extractor import extract_events_from_text
from app.rag.copilot import ask_copilot
from app.ml.risk_engine import compute_look_ahead_risk

class TestAIService(unittest.TestCase):
    def test_schema_extractor(self):
        sample_text = """
        DEPTH INTERVAL: 2310.0 m to 2345.0 m
        FORMATION: Tipam Sandstone
        INCIDENT CLASSIFICATION: LOSS
        SEVERITY: CRITICAL
        NPT RECORDED: 14.5 hours
        Mud Weight: 1.33 sg
        Volume Lost / Gained: 42.0 m3
        CAUSE: Encountered high permeability fractured sandstone stringer.
        MITIGATION APPLIED: Pumped 35 m3 coarse nut-plug LCM pill.
        FINAL OUTCOME: Losses sealed completely.
        """
        events = extract_events_from_text(sample_text, "DOC-01", "DIK-04", 1)
        self.assertGreater(len(events), 0)
        ev = events[0]
        self.assertEqual(ev["type"], "LOSS")
        self.assertEqual(ev["formation"], "Tipam Sandstone")
        self.assertGreaterEqual(ev["confidence"], 0.70)

    def test_copilot_rag(self):
        res = ask_copilot("What LCM pill was used for mud loss?")
        self.assertIn("answer", res)
        self.assertTrue(res["has_evidence"])
        self.assertGreater(len(res["citations"]), 0)

    def test_risk_engine(self):
        params = {"flow_in": 2400, "flow_out": 2360, "ecd": 1.33, "formation": "Tipam Sandstone"}
        pred = compute_look_ahead_risk(2268, params, [])
        self.assertIn("predictions", pred)
        self.assertIn("MUD_LOSS", pred["predictions"])
        self.assertGreater(pred["predictions"]["MUD_LOSS"]["composite_score"], 0.60)
        self.assertEqual(len(pred["predictions"]["MUD_LOSS"]["shap_top_3"]), 3)

if __name__ == "__main__":
    unittest.main()
