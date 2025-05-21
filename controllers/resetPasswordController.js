
// إضافة نهاية نقطة إعادة تعيين كلمة المرور

const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// فحص الإيميل وإرسال تأكيد
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'البريد الإلكتروني غير مسجل' });
  }

  // هنا يمكنك إرسال بريد حقيقي لاحقاً
  return res.status(200).json({ message: 'تم التحقق، يمكنك تعيين كلمة مرور جديدة الآن' });
};

// تعيين كلمة مرور جديدة
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'المستخدم غير موجود' });
  }

  user.password = password;
  await user.save();

  return res.status(200).json({ message: 'تم تعيين كلمة المرور بنجاح' });
};

module.exports = { forgotPassword, resetPassword };
