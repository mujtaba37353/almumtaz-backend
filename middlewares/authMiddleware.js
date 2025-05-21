const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Middleware لحماية المسارات بالتوكن
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // التأكد من وجود التوكن في الهيدر
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ تحميل المستخدم من قاعدة البيانات بدون كلمة المرور
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // في حال لم يوجد التوكن
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
