const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, registerAccount } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/resetPasswordController');
const { protect } = require('../middlewares/authMiddleware');

// انشاء حساب 
router.post('/register-account', registerAccount);

// تسجيل مستخدم جديد
router.post('/register', registerUser);

// تسجيل دخول مستخدم
router.post('/login', loginUser);

// جلب الملف الشخصي للمستخدم المسجل
router.get('/profile', protect, getProfile);

// استرجاع كلمة المرور
router.post('/forgot-password', forgotPassword);

// إعادة تعيين كلمة المرور
router.post('/reset-password', resetPassword);

module.exports = router;
