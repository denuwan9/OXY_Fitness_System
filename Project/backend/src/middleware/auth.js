const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('=== Auth Middleware ===');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Map the decoded token data to match the expected user object structure
    req.user = {
      _id: decoded.userId,
      role: decoded.role
    };
    
    console.log('User object set:', req.user);
    console.log('=====================');
    next();
  } catch (error) {
    console.error('=== Auth Middleware Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    console.error('=====================');
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 