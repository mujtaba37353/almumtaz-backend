const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        res.status(403);
        throw new Error('Access denied. Insufficient permissions.');
      }
      next();
    };
  };
  
  module.exports = { authorizeRoles };
  