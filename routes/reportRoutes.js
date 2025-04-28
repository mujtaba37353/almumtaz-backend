const express = require('express');
const router = express.Router();
const { getStoreSalesReport, getProductSalesReport } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// تقارير المبيعات
router.get('/store/:storeId', protect, authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin'), getStoreSalesReport);
router.get('/product/:productId', protect, authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin'), getProductSalesReport);

module.exports = router;
