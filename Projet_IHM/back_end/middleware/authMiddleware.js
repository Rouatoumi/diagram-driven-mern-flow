const jwt = require("jsonwebtoken");

// ✅ Authentication Middleware (Verify JWT)
const auth = (req, res, next) => {
  console.log("[Auth] Incoming Headers:", req.headers);
  const authHeader = req.headers.authorization;

  console.log("[Auth] Raw Authorization Header:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    console.error("[Auth] Malformed Authorization header");
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];
  console.log("[Auth] Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[Auth] Decoded Token:", decoded);

    req.user = decoded; // req.user will have { id, email, role } if you signed token with role
    next();
  } catch (error) {
    console.error("[Auth] Token Verification Failed:", error.message);
    let message = "Invalid token";
    if (error.name === "TokenExpiredError") {
      message = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Malformed token";
    }
    res.status(401).json({ message });
  }
};

// ✅ Authorization Middleware (Check Roles)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient rights" });
    }

    next();
  };
};

module.exports = {
  auth,
  authorizeRoles,
};
