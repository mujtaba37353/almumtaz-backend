const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// تسجيل مستخدم جديد
router.post('/register', registerUser);

// تسجيل دخول مستخدم
router.post('/login', loginUser);

// جلب الملف الشخصي للمستخدم المسجل
router.get('/profile', protect, getProfile);

module.exports = router;
