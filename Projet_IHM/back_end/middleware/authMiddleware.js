const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  console.log("[Auth] Incoming Headers:", req.headers);
  const authHeader = req.headers.authorization; // Changed from req.header() to req.headers
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
    req.user = decoded;
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

module.exports = auth;
