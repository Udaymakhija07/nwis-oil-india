import { Router } from "express";
import { loginSchema } from "../validators/schemas.js";

const router = Router();

router.post("/login", (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    res.json({
      token: "mock-jwt-token-oil-india-nwis",
      user: {
        id: "u-oil-001",
        email,
        name: "Pranjal Dutta (Senior Drilling Engineer)",
        role: "ENGINEER",
        organization: "Oil India Limited"
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/me", (req, res) => {
  res.json({
    id: "u-oil-001",
    email: "engineer@oilindia.in",
    name: "Pranjal Dutta (Senior Drilling Engineer)",
    role: "ENGINEER",
    organization: "Oil India Limited"
  });
});

export default router;
