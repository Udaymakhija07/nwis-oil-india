import test, { after } from "node:test";
import assert from "node:assert";
import http from "node:http";
import { app, server } from "../src/index.js";

function makeRequest(path, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "localhost",
        port: 5050,
        path,
        method
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

test("API Test Suite - NWIS Backend (SIH 2026 PS 26121)", async (t) => {
  await new Promise((r) => setTimeout(r, 400));

  await t.test("1. GET /health - Service is healthy", async () => {
    const res = await makeRequest("/health");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, "OK");
    assert.strictEqual(res.body.service, "nwis-backend");
  });

  await t.test("2. GET /api/docs - Returns API documentation", async () => {
    const res = await makeRequest("/api/docs");
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.endpoints));
    assert.ok(res.body.endpoints.length >= 8);
  });

  await t.test("3. GET /api/wells - Lists wells with pagination", async () => {
    const res = await makeRequest("/api/wells?limit=10");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.total, 60);
    assert.strictEqual(res.body.wells.length, 10);
  });

  await t.test("4. GET /api/wells/DIK-14/nearby - PostGIS radius query (< 300ms)", async () => {
    const start = Date.now();
    const res = await makeRequest("/api/wells/DIK-14/nearby?radius_km=10&min_score=0.35");
    const elapsed = Date.now() - start;

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.active_well_id, "DIK-14");
    assert.ok(res.body.count > 0);
    assert.ok(elapsed < 300, `Expected latency < 300ms, got ${elapsed}ms`);
    assert.ok(res.body.offsets[0].similarity_score >= 0.35);
  });

  await t.test("5. GET /api/wells/DIK-14/trajectory - Minimum Curvature 3D Path", async () => {
    const res = await makeRequest("/api/wells/DIK-14/trajectory");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.well_id, "DIK-14");
    assert.ok(res.body.stations.length > 5);
    assert.strictEqual(res.body.stations[0].md, 0);
  });

  await t.test("6. GET /api/events - Filter events by hazard type", async () => {
    const res = await makeRequest("/api/events?type=LOSS");
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.events.length > 0);
    assert.strictEqual(res.body.events[0].type, "LOSS");
  });

  await t.test("7. GET /api/formations - Returns Upper Assam Stratigraphic Column", async () => {
    const res = await makeRequest("/api/formations");
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.formations.length >= 6);
  });
});

after(() => {
  server.close();
});
