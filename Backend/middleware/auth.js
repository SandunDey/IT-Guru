import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


function verifyJWT(req, res, next) {

  const header = req.header("authorization");
  if (header != null) {
    const token = header.replace("Bearer ", "")
    console.log(token);
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      console.log(decoded);
      if (decoded != null) {
        req.user = decoded;
      }
    })
  }
  next()
}

export function requireAuth(req, res, next) {
  if (req.session?.user) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

// Optional: attach actor for audit fields
export function withActor(req, _res, next) {
  req.actor = req.session?.user?.email || "system";
  next();
}

export default verifyJWT;