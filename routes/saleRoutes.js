const express = require('express');
const router = express.Router();
const { createSale, getSales, getSalesByStore } = require('../controllers/saleController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// عمليات المبيعات
router.post('/', protect, authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin', 'StoreAccountant', 'Cashier'), createSale);
router.get('/', protect, authorizeRoles('AccountOwner', 'GeneralAccountant'), getSales);
router.get('/store/:storeId', protect, authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin', 'StoreAccountant'), getSalesByStore);

module.exports = router;
