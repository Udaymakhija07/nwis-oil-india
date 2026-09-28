import json
import math

with open("data-gen/seed_data.json") as f:
    data = json.load(f)

wells = data["wells"]
surveys = data["surveys"]
tops = data["formation_tops"]
events = data["events"]

active = [w for w in wells if w["well_id"] == "DIK-14"][0]
print("Active Well:", active["well_id"], "(", active["name"], ") Field:", active["field"], "Lat:", active["latitude"], "Lon:", active["longitude"])

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0 # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

radius_km = 10.0
nearby_offsets = []

for w in wells:
    if w["well_id"] == active["well_id"]:
        continue
    dist = haversine(active["latitude"], active["longitude"], w["latitude"], w["longitude"])
    if dist <= radius_km:
        s_prox = 0.30 * math.exp(-dist / 5.0)
        s_form = 0.25 * 0.90
        s_traj = 0.15 * (1.0 if w["well_type"] == active["well_type"] else 0.6)
        s_vint = 0.10 * 0.85
        s_mud = 0.10 * 0.90
        s_qual = 0.10 * 0.95
        score = s_prox + s_form + s_traj + s_vint + s_mud + s_qual
        
        w_events = [e for e in events if e["well_id"] == w["well_id"]]
        nearby_offsets.append({
            "well_id": w["well_id"],
            "name": w["name"],
            "distance_km": round(dist, 2),
            "similarity_score": round(score, 3),
            "events_count": len(w_events),
            "events": [e["type"] for e in w_events]
        })

nearby_offsets.sort(key=lambda x: x["distance_km"])

print(f"Radius query within {radius_km} km returned {len(nearby_offsets)} offset wells:")
for offset in nearby_offsets[:8]:
    print(f" - {offset['well_id']} | Dist: {offset['distance_km']} km | Score: {offset['similarity_score']} | Events: {offset['events_count']} {offset['events']}")
