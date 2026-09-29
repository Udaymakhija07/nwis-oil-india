import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import wellsRouter from "./routes/wells.js";
import eventsRouter from "./routes/events.js";
import formationsRouter from "./routes/formations.js";
import documentsRouter from "./routes/documents.js";
import authRouter from "./routes/auth.js";
import correlationRouter from "./routes/correlation.js";
import copilotRouter from "./routes/copilot.js";
import mlRouter from "./routes/ml.js";
import simulatorRouter from "./routes/simulator.js";
import simulatorService from "./services/simulatorService.js";
import { authenticate } from "./middleware/auth.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {

  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "nwis-backend",
    version: "1.0.0",
    system: "Nearby Wells Intelligence System (SIH 2026 - Oil India)",
    timestamp: new Date().toISOString()
  });
});

// API Documentation Endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "NWIS Core REST API",
      version: "1.0.0",
      description: "Nearby Wells Intelligence System for Oil India Limited (SIH 2026 PS 26121)"
    },
    endpoints: [
      { method: "GET", path: "/health", description: "Health check" },
      { method: "POST", path: "/api/auth/login", description: "Authenticate and get JWT" },
      { method: "GET", path: "/api/wells", description: "Filter and list all indexed wells" },
      { method: "GET", path: "/api/wells/:id", description: "Get well details, tops, events, and casing" },
      { method: "GET", path: "/api/wells/:id/nearby", description: "Find nearby offset wells with similarity ranking" },
      { method: "GET", path: "/api/wells/:id/trajectory", description: "3D directional surveys (Minimum Curvature)" },
      { method: "GET", path: "/api/events", description: "Search historical drilling events and NPT" },
      { method: "GET", path: "/api/events/stats", description: "Aggregated NPT and hazard statistics" },
      { method: "GET", path: "/api/formations", description: "Stratigraphic formation profiles" },
      { method: "GET", path: "/api/documents", description: "List indexed WCR & DDR reports with source citations" }
    ]
  });
});

// Mount Routes
app.use("/api/auth", authRouter);
app.use("/api/wells", authenticate, wellsRouter);
app.use("/api/events", authenticate, eventsRouter);
app.use("/api/formations", authenticate, formationsRouter);
app.use("/api/documents", authenticate, documentsRouter);
app.use("/api/ai", authenticate, documentsRouter);
app.use("/api/correlation", authenticate, correlationRouter);
app.use("/api/copilot", authenticate, copilotRouter);
app.use("/api/ml", authenticate, mlRouter);
app.use("/api/simulator", authenticate, simulatorRouter);

// Real-time eRTMAC WebSocket stream
simulatorService.setSocketIO(io);

io.on("connection", (socket) => {
  console.log("[NWIS Socket] Rig client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("[NWIS Socket] Rig client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`[NWIS Backend] Server running on http://localhost:${PORT}`);
});

export { app, server, io };
