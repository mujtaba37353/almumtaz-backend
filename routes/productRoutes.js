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

// CRUD المنتجات
router.post('/', protect, authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin', 'StoreAccountant'), createProduct);
router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.put('/:id', protect, authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin', 'StoreAccountant'), updateProduct);
router.delete('/:id', protect, authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin', 'StoreAccountant'), deleteProduct);
router.post('/copy', protect, authorizeRoles('AccountOwner', 'GeneralAccountant'), copyProductsToAnotherStore);

module.exports = router;
