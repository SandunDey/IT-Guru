import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function verifyJWT(req, res, next) {
  const header = req.header("authorization");
  if (header != null) {
    const token = header.replace("Bearer ", "");
    console.log(token);
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      console.log(decoded);
      if (decoded != null) {
  req.user = { id: decoded.sub, ...decoded };
      }
    });
  }
  next();
}

// Middleware to require authentication
export function requireAuth(req, res, next) {
  if (req.user && req.user.email) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required. Please log in." });
}

// Middleware to require admin role
export function requireAdmin(req, res, next) {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: "Authentication required." });
  }
  
  if (!req.user.role || req.user.role.toLowerCase() !== 'admin') {
    return res.status(403).json({ message: "Admin privileges required." });
  }
  
  return next();
}

// Middleware to require admin or staff role
export function requireAdminOrStaff(req, res, next) {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: "Authentication required." });
  }
  
  if (!req.user.role || !['admin', 'staff'].includes(req.user.role.toLowerCase())) {
    return res.status(403).json({ message: "Admin or Staff privileges required." });
  }
  
  return next();
}

// Optional: attach actor for audit fields
export function withActor(req, _res, next) {
  req.actor = req.user?.email || "system";
  next();
}

export default verifyJWT;