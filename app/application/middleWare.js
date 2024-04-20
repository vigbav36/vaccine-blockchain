// authMiddleware.js

function requireAuth(req, res, next) {
    if (req.session.isAuthenticated) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
  
  module.exports = requireAuth;
  