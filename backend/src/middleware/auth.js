// Simple Mock JWT & RBAC Middleware
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Default to guest ENGINEER for seamless hackathon testing
    req.user = {
      id: "u-oil-001",
      email: "engineer@oilindia.in",
      role: "ENGINEER",
      name: "Pranjal Dutta (Senior Drilling Engineer)"
    };
    return next();
  }

  const token = authHeader.split(" ")[1];
  // Basic token decode
  req.user = {
    id: "u-oil-001",
    email: "engineer@oilindia.in",
    role: "ENGINEER",
    name: "Pranjal Dutta (Senior Drilling Engineer)"
  };
  next();
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: insufficient role privileges" });
    }
    next();
  };
};
