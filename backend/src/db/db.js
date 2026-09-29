import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localSeedPath = path.resolve(__dirname, "seed_data.json");
const rootSeedPath = path.resolve(__dirname, "../../../data-gen/seed_data.json");
const seedPath = fs.existsSync(localSeedPath) ? localSeedPath : rootSeedPath;

let memoryDb = null;
if (fs.existsSync(seedPath)) {
  try {
    memoryDb = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
    console.log(`[NWIS DB] Loaded ${memoryDb.wells.length} synthetic wells in memory fallback.`);
  } catch (err) {
    console.error("[NWIS DB] Error loading seed JSON:", err.message);
  }
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgres://nwis_admin:nwis_secure_pass_2026@localhost:5432/nwis_db",
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000
});

let isPostgresOnline = false;

// Attempt initial connection test
pool.query("SELECT 1", (err) => {
  if (!err) {
    isPostgresOnline = true;
    console.log("[NWIS DB] Connected to PostgreSQL + PostGIS.");
  } else {
    isPostgresOnline = false;
    console.log("[NWIS DB] PostgreSQL offline or unreachable. Using robust high-performance in-memory data store.");
  }
});

export const db = {
  isOnline: () => isPostgresOnline,
  pool,
  getMemoryDb: () => memoryDb,
  query: async (text, params) => {
    if (isPostgresOnline) {
      return pool.query(text, params);
    }
    return { rows: [] };
  }
};

export default db;
