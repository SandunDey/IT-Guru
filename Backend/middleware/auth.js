import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_KEY || "dev-secret";

/**
 * Extract a Bearer token from the Authorization header (or cookie fallback).
 */
function getToken(req) {
  const header = req.headers.authorization || req.header?.("authorization");
  if (header && header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  // Optional cookie fallback:
  if (req.cookies?.token) return req.cookies.token;
  return null;
}

/**
 * authOptional:
 * - If a token is present and valid -> attaches req.user
 * - If missing/invalid -> does NOT block; just continues without user
 */
export function authOptional(req, _res, next) {
  const token = getToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // e.g. { sub, email, role, iat, exp }
  } catch {
    // ignore invalid token in optional mode
  }
  return next();
}

/**
 * authRequired:
 * - Requires a valid JWT. Otherwise 401.
 * - Attaches req.user on success.
 */
export function authRequired(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * requireRole("admin"):
 * - Must be used AFTER authRequired/authOptional.
 * - If authOptional is used, it will 401 if not logged in, 403 if wrong role.
 */
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}

/**
 * Legacy session-based guard you had earlier.
 * Prefer authRequired (JWT), but leaving this here if you still use sessions.
 */
export function requireAuth(req, res, next) {
  if (req.session?.user || req.user) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

/**
 * Attach an "actor" string for auditing (email or "system").
 */
export function withActor(req, _res, next) {
  req.actor =
    req.user?.email ||
    req.session?.user?.email ||
    "system";
  next();
}

/**
 * Default export:
 * - behaves like your original verifyJWT but safely (optional parse).
 */
export default authOptional;
