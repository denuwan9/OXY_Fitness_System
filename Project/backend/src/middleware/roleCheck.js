/**
 * Role-based access control middleware
 * @param {string|string[]} roles - Single role or array of allowed roles
 * @returns Middleware function that checks user's role
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized - No user found',
        code: 'UNAUTHORIZED'
      });
    }

    // Normalize roles to array
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user has required role
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden - Insufficient permissions',
        requiredRoles,
        userRole: req.user.role,
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};

export { checkRole };  // Named export