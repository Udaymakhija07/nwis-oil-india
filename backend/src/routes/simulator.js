import { Router } from "express";
import simulatorService from "../services/simulatorService.js";
import alertEngine from "../services/alertEngine.js";

const router = Router();

router.get("/state", (req, res) => {
  res.json(simulatorService.getState());
});

router.post("/play", (req, res) => {
  simulatorService.start();
  res.json(simulatorService.getState());
});

router.post("/pause", (req, res) => {
  simulatorService.pause();
  res.json(simulatorService.getState());
});

router.post("/reset", (req, res) => {
  res.json(simulatorService.reset());
});

router.post("/step", (req, res) => {
  simulatorService.tick();
  res.json(simulatorService.getState());
});

router.post("/speed", (req, res) => {
  const { speed = 1.0 } = req.body;
  simulatorService.setSpeed(speed);
  res.json(simulatorService.getState());
});

router.post("/alerts/:id/feedback", (req, res) => {
  const feedback = alertEngine.recordFeedback(req.params.id, req.body);
  res.json({ status: "SAVED", feedback });
});

export default router;
