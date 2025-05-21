const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  copyProductsToAnotherStore
} = require('../controllers/productController');

const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// ✅ إنشاء منتج - يشمل الكاشير أيضًا
router.post(
  '/',
  protect,
  authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin', 'StoreAccountant', 'Cashier'),
  createProduct
);

// ✅ قراءة المنتجات - التحقق داخل الكنترولر حسب الدور
router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);

// ✅ تعديل المنتجات - لا يشمل الكاشير
router.put(
  '/:id',
  protect,
  authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin', 'StoreAccountant'),
  updateProduct
);

// ✅ حذف المنتجات - لا يشمل الكاشير
router.delete(
  '/:id',
  protect,
  authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin', 'StoreAccountant'),
  deleteProduct
);

// ✅ نسخ المنتجات من متجر إلى آخر - فقط للحساب أو المحاسب العام
router.post(
  '/copy',
  protect,
  authorizeRoles('AccountOwner', 'GeneralAccountant'),
  copyProductsToAnotherStore
);

module.exports = router;
