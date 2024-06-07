import jwt from 'jsonwebtoken';
import secretKey from '../../js/crypto.js';

const verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secretKey);

    // Attach the decoded payload to the request object for use in subsequent middleware or routes
    req.userId = decoded.userId;
    
    // Proceed to the next middleware or route
    next();
  } catch (error) {
    // If token verification fails due to expiration
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    // If token verification fails due to invalid token format or signature
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    // For any other errors, return a generic error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default verifyToken;
