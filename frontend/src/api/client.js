const BASE_URL = "http://localhost:5050/api";

export async function fetchWells(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(BASE_URL + "/wells?" + query);
    if (res.ok) return await res.json();
  } catch (err) {}
  return { total: 0, wells: [] };
}

export async function fetchWellDetails(wellId) {
  try {
    const res = await fetch(BASE_URL + "/wells/" + wellId);
    if (res.ok) return await res.json();
  } catch (err) {}
  return null;
}

export async function fetchNearbyOffsets(activeWellId, radiusKm = 10, minScore = 0.35) {
  try {
    const res = await fetch(BASE_URL + "/wells/" + activeWellId + "/nearby?radius_km=" + radiusKm + "&min_score=" + minScore);
    if (res.ok) return await res.json();
  } catch (err) {}
  return { count: 0, offsets: [] };
}

export async function fetchEvents(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(BASE_URL + "/events?" + query);
    if (res.ok) return await res.json();
  } catch (err) {}
  return { total: 0, events: [] };
}

export async function fetchEventStats() {
  try {
    const res = await fetch(BASE_URL + "/events/stats");
    if (res.ok) return await res.json();
  } catch (err) {}
  return { total_events: 0, total_npt_hours: 0, estimated_cost_usd: 0, by_type: {}, by_formation: {} };
}

export async function fetchFormations() {
  try {
    const res = await fetch(BASE_URL + "/formations");
    if (res.ok) return await res.json();
  } catch (err) {}
  return { formations: [] };
}

export async function fetchDocuments() {
  try {
    const res = await fetch(BASE_URL + "/documents");
    if (res.ok) return await res.json();
  } catch (err) {}
  return { total: 0, documents: [] };
}
