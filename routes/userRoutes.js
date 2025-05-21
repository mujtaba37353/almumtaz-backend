const express = require('express');
const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  updateCurrentUser,
  assignUserToStore,
  removeUserFromStore
} = require('../controllers/userController');

const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// ✅ الصلاحيات موزعة حسب الدور، والتحقق الداخلي يتم داخل الـ controller نفسه

// ✅ راوت لجلب معلومات المستخدم الحالي
router.get('/profile', protect, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not found' });
  }
  res.status(200).json(req.user); // يحتوي على role و account و store إن وجدوا
});

// ✅ تحديث بيانات المستخدم الحالي
router.patch('/profile', protect, updateCurrentUser);

// جلب المستخدمين
router.get(
  '/',
  protect,
  authorizeRoles(
    'AppOwner',
    'AppAdmin',
    'AccountOwner',
    'GeneralAccountant',
    'StoreAdmin'
  ),
  getUsers
);

// جلب مستخدم
router.get(
  '/:id',
  protect,
  authorizeRoles('AppOwner', 'AppAdmin', 'AccountOwner', 'GeneralAccountant', 'StoreAdmin'),
  getUserById
);

// إنشاء مستخدم
router.post(
  '/',
  protect,
  authorizeRoles(
    'AppOwner',
    'AppAdmin',
    'AccountOwner',
    'GeneralAccountant',
    'StoreAdmin'
  ),
  createUser
);

// تحديث مستخدم
router.put(
  '/:id',
  protect,
  authorizeRoles(
    'AppOwner',
    'AppAdmin',
    'AccountOwner',
    'GeneralAccountant',
    'StoreAdmin'
  ),
  updateUser
);

// حذف مستخدم
router.delete(
  '/:id',
  protect,
  authorizeRoles(
    'AppOwner',
    'AccountOwner',
    'GeneralAccountant',
    'StoreAdmin'
  ),
  deleteUser
);

// ✅ ربط مستخدم بمتجر
router.patch(
  '/:id/assign-store',
  protect,
  authorizeRoles('AccountOwner', 'GeneralAccountant'),
  assignUserToStore
);

// ✅ إزالة مستخدم من متجره
router.patch(
  '/:id/remove-store',
  protect,
  authorizeRoles('AccountOwner', 'GeneralAccountant'),
  removeUserFromStore
);

module.exports = router;
