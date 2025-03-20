const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if the authorization header exists and starts with "Bearer"
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]; // Extract the token

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach the decoded user to the request object
      console.log("The decoded user is:", decoded); // Debugging
      next(); // Pass control to the next middleware or route handler
    } catch (err) {
      // Handle specific JWT errors
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        return res.status(500).json({ message: "Server error during token verification" });
      }
    }
  } else {
    // No token provided
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

module.exports = verifyToken;