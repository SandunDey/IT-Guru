import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Get token from request
function getToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  return null;
}

// Support Ticket Specific Middleware
export const ticketAuth = (req, res, next) => {
  const token = getToken(req);
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required for ticket access" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check if user owns the ticket or is staff/admin
export const checkTicketOwnership = async (req, res, next) => {
  try {
    const Ticket = (await import('../model/SupportTicketModel.js')).default;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Staff and Admin can access any ticket
    if (req.user.role === 'staff' || req.user.role === 'admin') {
      return next();
    }

    // Students can only access their own tickets
    if (req.user.role === 'student' && ticket.email === req.user.email) {
      return next();
    }

    return res.status(403).json({ message: 'Access denied to this ticket' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Allow only specific roles
export const requireRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};