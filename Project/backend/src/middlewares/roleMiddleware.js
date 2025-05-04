/**
 * Role-based authorization middleware
 * @param {...string} allowedRoles - Spread of allowed roles
 * @returns {Function} Express middleware function
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                success: false,
                code: "UNAUTHORIZED",
                message: "User authentication required"
            });
        }

        // Check if user has any of the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                code: "FORBIDDEN",
                message: "Insufficient permissions",
                requiredRoles: allowedRoles,
                userRole: req.user.role
            });
        }

        next();
    };
};

