import json
import random
import math
import pathlib
from datetime import datetime, timedelta

ROOT = pathlib.Path("/Users/udaymakhija/.gemini/antigravity/scratch/nwis")

# Fields in Upper Assam Basin (Oil India assets)
FIELDS = {
    "Dikom": {
        "center_lat": 27.4820,
        "center_lon": 95.1250,
        "block": "BLOCK-ASSAM-OIL-01",
        "wells_count": 25,
        "prefix": "DIK",
        "base_depth": 3800
    },
    "Nahorkatiya": {
        "center_lat": 27.2840,
        "center_lon": 95.3310,
        "block": "BLOCK-ASSAM-OIL-02",
        "wells_count": 20,
        "prefix": "NHK",
        "base_depth": 4100
    },
    "Moran": {
        "center_lat": 27.1850,
        "center_lon": 94.9210,
        "block": "BLOCK-ASSAM-OIL-03",
        "wells_count": 15,
        "prefix": "MOR",
        "base_depth": 3650
    }
}

# Stratigraphic column in Upper Assam
FORMATIONS_TEMPLATE = [
    {"name": "Alluvium", "thickness": 350, "lithology": "Sand, Gravel & Clay", "hazard": None, "prob": 0.0},
    {"name": "Dhekiajuli Sandstone", "thickness": 600, "lithology": "Coarse Sandstone & Claystone", "hazard": None, "prob": 0.0},
    {"name": "Girujan Clay", "thickness": 850, "lithology": "Mottled Clay & Siltstone", "hazard": "TORQUE_DRAG", "prob": 0.08},
    {"name": "Tipam Sandstone", "thickness": 800, "lithology": "Massive Porous Sandstone", "hazard": "LOSS", "prob": 0.28},
    {"name": "Surma Group", "thickness": 450, "lithology": "Alternating Sandstone & Shale", "hazard": "TORQUE_DRAG", "prob": 0.10},
    {"name": "Barail Coal-Shale", "thickness": 650, "lithology": "Carbonaceous Shale, Coal & Sandstone", "hazard": "KICK", "prob": 0.18},
    {"name": "Kopili Shale", "thickness": 400, "lithology": "Fissile Splintery Marine Shale", "hazard": "STUCK", "prob": 0.22},
    {"name": "Jaintia Limestone", "thickness": 300, "lithology": "Nummulitic Limestone", "hazard": None, "prob": 0.05}
]

def calculate_min_curvature(surveys):
    """Calculates TVD, North, East using standard oilfield Minimum Curvature Method"""
    results = []
    # Surface point
    results.append({"md": 0.0, "inc": 0.0, "azi": 0.0, "tvd": 0.0, "north": 0.0, "east": 0.0, "dls": 0.0})
    
    for i in range(1, len(surveys)):
        p1 = results[i-1]
        p2 = surveys[i]
        
        md1, inc1, azi1 = p1["md"], math.radians(p1["inc"]), math.radians(p1["azi"])
        md2, inc2, azi2 = p2["md"], math.radians(p2["inc"]), math.radians(p2["azi"])
        
        delta_md = md2 - md1
        if delta_md <= 0:
            continue
            
        # Dogleg angle beta
        cos_beta = math.cos(inc2 - inc1) - (math.sin(inc1) * math.sin(inc2) * (1 - math.cos(azi2 - azi1)))
        cos_beta = max(-1.0, min(1.0, cos_beta))
        beta = math.acos(cos_beta)
        
        if beta < 1e-6:
            rf = 1.0 # Ratio factor
            dls = 0.0
        else:
            rf = (2.0 / beta) * math.tan(beta / 2.0)
            dls = (beta * 180.0 / math.pi) * (30.0 / delta_md)
            
        delta_tvd = (delta_md / 2.0) * (math.cos(inc1) + math.cos(inc2)) * rf
        delta_north = (delta_md / 2.0) * (math.sin(inc1) * math.cos(azi1) + math.sin(inc2) * math.cos(azi2)) * rf
        delta_east = (delta_md / 2.0) * (math.sin(inc1) * math.sin(azi1) + math.sin(inc2) * math.sin(azi2)) * rf
        
        results.append({
            "md": round(md2, 2),
            "inc": round(p2["inc"], 2),
            "azi": round(p2["azi"], 2),
            "tvd": round(p1["tvd"] + delta_tvd, 2),
            "north": round(p1["north"] + delta_north, 2),
            "east": round(p1["east"] + delta_east, 2),
            "dls": round(dls, 2)
        })
    return results

print("Starting generation of 60 Upper Assam wells...")
random.seed(42)

all_wells = []
all_surveys = []
all_tops = []
all_events = []
all_casing = []
all_drilling_ts = []
all_lessons = []

well_counter = 1

for field_name, fcfg in FIELDS.items():
    for w_idx in range(1, fcfg["wells_count"] + 1):
        well_id = f"{fcfg['prefix']}-{w_idx:02d}"
        well_name = f"Well {field_name} #{w_idx:02d}"
        
        # Spatial scatter around field center (radius up to ~8 km)
        r_offset = random.uniform(0.3, 7.5) * 1000 # metres
        theta = random.uniform(0, 2 * math.pi)
        dx = r_offset * math.cos(theta)
        dy = r_offset * math.sin(theta)
        
        lat = fcfg["center_lat"] + (dy / 111111.0)
        lon = fcfg["center_lon"] + (dx / (111111.0 * math.cos(math.radians(fcfg["center_lat"]))))
        
        is_active = (well_id == "DIK-14")
        well_type = "DIRECTIONAL" if random.random() > 0.3 else "VERTICAL"
        td_target = fcfg["base_depth"] + random.randint(-250, 350)
        
        # 1. Build surveys
        raw_surveys = [{"md": 0.0, "inc": 0.0, "azi": 0.0}]
        curr_md = 0
        target_inc = 0.0 if well_type == "VERTICAL" else random.uniform(18.0, 42.0)
        target_azi = random.uniform(30.0, 280.0)
        kickoff_depth = random.randint(600, 1100)
        
        while curr_md < td_target:
            curr_md += random.randint(150, 250)
            if curr_md > td_target:
                curr_md = td_target
            if curr_md <= kickoff_depth:
                inc = 0.0
                azi = target_azi
            else:
                # Build section up to target inc
                progress = min(1.0, (curr_md - kickoff_depth) / 800.0)
                inc = target_inc * progress
                azi = target_azi + random.uniform(-2.0, 2.0)
            raw_surveys.append({"md": curr_md, "inc": inc, "azi": azi})
            
        computed_surveys = calculate_min_curvature(raw_surveys)
        td_tvd = computed_surveys[-1]["tvd"]
        
        wells_entry = {
            "well_id": well_id,
            "name": well_name,
            "field": field_name,
            "block": fcfg["block"],
            "status": "DRILLING" if is_active else "COMPLETED",
            "latitude": round(lat, 6),
            "longitude": round(lon, 6),
            "kb_elev": round(random.uniform(112.0, 128.0), 2),
            "spud_date": (datetime(2018, 1, 1) + timedelta(days=random.randint(0, 2200))).strftime("%Y-%m-%d"),
            "td_md": round(td_target, 2),
            "td_tvd": round(td_tvd, 2),
            "well_type": well_type,
            "rig": f"OIL-RIG-{random.randint(3, 14):02d}"
        }
        all_wells.append(wells_entry)
        
        for s in computed_surveys:
            s["well_id"] = well_id
            all_surveys.append(s)
            
        # 2. Formation Tops (with realistic structural dip)
        dip_factor = (dx * 0.02 + dy * 0.03) # Geological dip variation
        current_top_md = 0.0
        
        for f_info in FORMATIONS_TEMPLATE:
            # Thickness with random variation
            th = f_info["thickness"] + random.randint(-40, 50) + (dip_factor * 0.05)
            th = max(120.0, th)
            bottom_md = current_top_md + th
            
            # Find TVD at top_md
            top_tvd = current_top_md * (td_tvd / td_target) # approximation for survey TVD
            bottom_tvd = bottom_md * (td_tvd / td_target)
            
            top_entry = {
                "well_id": well_id,
                "formation": f_info["name"],
                "top_md": round(current_top_md, 2),
                "top_tvd": round(top_tvd, 2),
                "bottom_md": round(bottom_md, 2),
                "bottom_tvd": round(bottom_tvd, 2),
                "lithology": f_info["lithology"],
                "pressure_regime": "OVERPRESSURED" if "Barail" in f_info["name"] else "NORMAL"
            }
            all_tops.append(top_entry)
            
            # 3. Hazardous Events generation based on exact formation probabilities
            if f_info["prob"] > 0 and random.random() < f_info["prob"] and not is_active:
                event_type = f_info["hazard"]
                ev_md_from = round(current_top_md + random.uniform(30.0, th - 40.0), 2)
                ev_md_to = round(ev_md_from + random.uniform(15.0, 45.0), 2)
                
                if event_type == "LOSS":
                    vol_lost = random.randint(22, 68)
                    cause = "Natural micro-fractures in Tipam sands intersected under high ECD (> 1.34 sg)"
                    mitigation = "Spotted 30 ppb coarse LCM pill (NutPlug + Mica). Reduced pump rate from 2400 to 2050 LPM. Reduced mud weight to 1.28 sg."
                    outcome = "Full circulation regained after 7.5 hours NPT. Drilling resumed with controlled ECD."
                    sev = "WARNING" if vol_lost < 40 else "CRITICAL"
                    npt_h = random.uniform(5.0, 14.0)
                    mud_wt = 1.32
                elif event_type == "KICK":
                    vol_lost = 0
                    cause = "Encountered high-pressure gas sand stringer in Upper Barail; sudden D-exponent drop and pit gain of 2.4 m3"
                    mitigation = "Shut-in on annular BOP. Recorded SIDPP=380 psi, SICP=520 psi. Circulated gas bubble via Wait & Weight method. Weighted up mud to 1.44 sg."
                    outcome = "Well killed safely after 16 hours. Resumed drilling with zero gas units."
                    sev = "CRITICAL"
                    npt_h = random.uniform(12.0, 28.0)
                    mud_wt = 1.38
                elif event_type == "STUCK":
                    vol_lost = 0
                    cause = "Reactive Kopili shale sloughing and pack-off during wiper trip; overpull exceeded 140 klbs"
                    mitigation = "Jarred downwards at 110 klbs overpull. Spotted 50 bbl glycol-based lubricant pill. Worked pipe with 35 RPM rotation."
                    outcome = "String freed after 11 hours. Conditioned mud with KCl-Polymer inhibitor."
                    sev = "HIGH"
                    npt_h = random.uniform(8.0, 22.0)
                    mud_wt = 1.30
                else: # TORQUE_DRAG
                    vol_lost = 0
                    cause = "Severe torque fluctuations (> 28 kN.m) due to hole cleaning deficit and dogleg severity in Girujan clays"
                    mitigation = "Pumped high-viscosity tandem sweep. Back-reamed 12 stands with maximum flow rate."
                    outcome = "Torque stabilized back to 16 kN.m. Resumed drilling."
                    sev = "MEDIUM"
                    npt_h = random.uniform(3.0, 8.0)
                    mud_wt = 1.25
                
                ev_id = f"EV-{well_id}-{random.randint(100, 999)}"
                doc_name = f"WCR_{well_id}_FINAL.pdf"
                page_no = random.randint(12, 38)
                quote = f"At depth {ev_md_from}m in {f_info['name']}, {cause.lower()}. Action taken: {mitigation}"
                
                event_entry = {
                    "event_id": ev_id,
                    "well_id": well_id,
                    "type": event_type,
                    "md_from": ev_md_from,
                    "md_to": ev_md_to,
                    "tvd": round(ev_md_from * (td_tvd / td_target), 2),
                    "formation": f_info["name"],
                    "start_ts": (datetime(2020, 1, 1) + timedelta(days=random.randint(0, 1500))).strftime("%Y-%m-%d %H:%M:%S"),
                    "duration_h": round(npt_h + 3.0, 1),
                    "npt_h": round(npt_h, 1),
                    "severity": sev,
                    "volume_lost_m3": vol_lost,
                    "mud_wt": mud_wt,
                    "cause": cause,
                    "mitigation": mitigation,
                    "outcome": outcome,
                    "source_doc_id": doc_name,
                    "page": page_no,
                    "evidence_quote": quote,
                    "confidence": round(random.uniform(0.89, 0.98), 2),
                    "verified": True
                }
                all_events.append(event_entry)
                
                # Create Lesson Learned card
                all_lessons.append({
                    "event_id": ev_id,
                    "well_id": well_id,
                    "formation": f_info["name"],
                    "md_range": f"{ev_md_from:.0f}m - {ev_md_to:.0f}m",
                    "summary": f"Severe {event_type} in {f_info['name']} due to {cause[:50]}...",
                    "recommendation": mitigation,
                    "votes_up": random.randint(8, 24),
                    "votes_down": random.randint(0, 2),
                    "verified_by": "Chief Drilling Superintendent, OIL Field Headquarters Duliajan"
                })

            current_top_md = bottom_md
            if current_top_md >= td_target:
                break
                
        # 4. Casing Program
        all_casing.append({"well_id": well_id, "string_type": "CONDUCTOR", "size_in": 20.0, "shoe_md": 90.0, "shoe_tvd": 90.0, "grade": "K-55", "weight_ppf": 94.0})
        all_casing.append({"well_id": well_id, "string_type": "SURFACE", "size_in": 13.375, "shoe_md": 920.0, "shoe_tvd": 915.0, "grade": "L-80", "weight_ppf": 68.0})
        all_casing.append({"well_id": well_id, "string_type": "INTERMEDIATE", "size_in": 9.625, "shoe_md": 2680.0, "shoe_tvd": 2540.0, "grade": "N-80", "weight_ppf": 47.0})
        all_casing.append({"well_id": well_id, "string_type": "PRODUCTION", "size_in": 7.0, "shoe_md": td_target, "shoe_tvd": td_tvd, "grade": "P-110", "weight_ppf": 29.0})

# 5. Generate Real-time precursor stream for active well DIK-14 (drilling towards 2,310m loss zone)
active_well_md = 2000.0
curr_time = datetime.now() - timedelta(hours=8)
while active_well_md <= 2268.0:
    # Sensor values
    rop = random.uniform(14.0, 22.0)
    wob = random.uniform(12.0, 16.0)
    rpm = random.uniform(110.0, 125.0)
    torque = 14.0 + (active_well_md - 2000.0) * 0.008 + random.uniform(-1.0, 1.0)
    spp = 2400.0 + random.uniform(-40.0, 40.0)
    flow_in = 2400.0
    # Approaching Tipam loss zone: flow out starts to show subtle deficit
    deficit = 0.0
    if active_well_md > 2240.0:
        deficit = (active_well_md - 2240.0) * 1.5
    flow_out = flow_in - deficit + random.uniform(-15.0, 15.0)
    pit_vol = 85.0 - (deficit * 0.05)
    
    all_drilling_ts.append({
        "well_id": "DIK-14",
        "ts": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
        "md": round(active_well_md, 2),
        "rop": round(rop, 2),
        "wob": round(wob, 2),
        "rpm": round(rpm, 1),
        "torque": round(torque, 2),
        "spp": round(spp, 1),
        "flow_in": round(flow_in, 1),
        "flow_out": round(flow_out, 1),
        "pit_vol": round(pit_vol, 2),
        "hookload": round(145.0 + random.uniform(-3.0, 3.0), 1),
        "mw_in": 1.28,
        "ecd": round(1.31 + (active_well_md - 2000.0) * 0.0001, 3)
    })
    active_well_md += 2.0
    curr_time += timedelta(minutes=6)

print(f"Generated {len(all_wells)} wells, {len(all_surveys)} survey stations, {len(all_tops)} formation tops, {len(all_events)} historical events!")

# Export JSON data
output_data = {
    "wells": all_wells,
    "surveys": all_surveys,
    "formation_tops": all_tops,
    "events": all_events,
    "casing_program": all_casing,
    "lessons": all_lessons,
    "drilling_ts": all_drilling_ts
}

with open(ROOT / "data-gen/seed_data.json", "w") as f:
    json.dump(output_data, f, indent=2)

# Generate standalone SQL INSERT file for instant DB seeding
sql_lines = []
sql_lines.append("-- Auto-generated NWIS Upper Assam Synthetic Seed Dataset")
sql_lines.append("TRUNCATE TABLE wells, well_surveys, formation_tops, events, casing_program, drilling_ts, lessons CASCADE;")

for w in all_wells:
    sql_lines.append(
        f"INSERT INTO wells (well_id, name, field, block, status, latitude, longitude, surface_geom, kb_elev, spud_date, td_md, td_tvd, well_type, rig) "
        f"VALUES ('{w['well_id']}', '{w['name']}', '{w['field']}', '{w['block']}', '{w['status']}', {w['latitude']}, {w['longitude']}, ST_SetSRID(ST_MakePoint({w['longitude']}, {w['latitude']}), 4326), {w['kb_elev']}, '{w['spud_date']}', {w['td_md']}, {w['td_tvd']}, '{w['well_type']}', '{w['rig']}');"
    )

for t in all_tops:
    sql_lines.append(
        f"INSERT INTO formation_tops (well_id, formation, top_md, top_tvd, bottom_md, bottom_tvd, lithology, pressure_regime) "
        f"VALUES ('{t['well_id']}', '{t['formation']}', {t['top_md']}, {t['top_tvd']}, {t['bottom_md']}, {t['bottom_tvd']}, '{t['lithology']}', '{t['pressure_regime']}');"
    )

for ev in all_events:
    c = ev['cause'].replace("'", "")
    m = ev['mitigation'].replace("'", "")
    o = ev['outcome'].replace("'", "")
    q = ev['evidence_quote'].replace("'", "")
    sql_lines.append(
        f"INSERT INTO events (event_id, well_id, type, md_from, md_to, tvd, formation, start_ts, duration_h, npt_h, severity, volume_lost_m3, mud_wt, cause, mitigation, outcome, source_doc_id, page, evidence_quote, confidence, verified) "
        f"VALUES ('{ev['event_id']}', '{ev['well_id']}', '{ev['type']}', {ev['md_from']}, {ev['md_to']}, {ev['tvd']}, '{ev['formation']}', '{ev['start_ts']}', {ev['duration_h']}, {ev['npt_h']}, '{ev['severity']}', {ev['volume_lost_m3']}, {ev['mud_wt']}, '{c}', '{m}', '{o}', '{ev['source_doc_id']}', {ev['page']}, '{q}', {ev['confidence']}, true);"
    )

with open(ROOT / "backend/src/db/seed.sql", "w") as f:
    f.write("\n".join(sql_lines))

print("seed_data.json and seed.sql successfully generated in backend/src/db!")
