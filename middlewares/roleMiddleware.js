// هذا الميدل وير يسمح فقط للأدوار المصرح لها بالوصول إلى الراوت

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // التأكد من وجود مستخدم
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: no user in request' });
    }

    // التحقق من أن الدور مسموح به
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: role '${req.user.role}' is not authorized.`,
      });
    }

    // السماح بالوصول
    next();
  };
};

module.exports = { authorizeRoles };
