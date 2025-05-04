import jwt from "jsonwebtoken";

/**
 * JWT Authentication Middleware
 * Verifies the JWT token from the Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;

    // Check for Bearer token format
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ 
            success: false,
            code: "MISSING_TOKEN",
            message: "Authorization token required" 
        });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user to request
        req.user = {
            id: decoded.userId,
            role: decoded.role,
            ...decoded // Include any additional claims
        };

        console.debug("Token verified for user:", req.user);
        next();

    } catch (err) {
        console.error("Token verification error:", err);

        const response = {
            success: false,
            message: "Authentication failed"
        };

        switch (err.name) {
            case "TokenExpiredError":
                response.code = "TOKEN_EXPIRED";
                response.message = "Session expired, please login again";
                return res.status(401).json(response);
            case "JsonWebTokenError":
                response.code = "INVALID_TOKEN";
                response.message = "Invalid authentication token";
                return res.status(401).json(response);
            default:
                response.code = "AUTH_ERROR";
                return res.status(500).json(response);
        }
    }
};

export default verifyToken;