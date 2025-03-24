const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    // Convert single role to array if needed
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    // Map backend roles to frontend roles
    const userRole = req.user.role === 'trainer' ? 'coach' : req.user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Forbidden - Insufficient permissions',
        requiredRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

module.exports = { checkRole }; 