const express = require('express');
const router = express.Router();
const { 
  createAccount, 
  getAccounts, 
  getAccountById, 
  updateAccount, 
  deleteAccount 
} = require('../controllers/accountController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// ربط المسارات مع الصلاحيات
router.post('/', protect, authorizeRoles('AccountOwner'), createAccount);
router.get('/', protect, authorizeRoles('AppOwner', 'AppAdmin'), getAccounts);
router.get('/:id', protect, authorizeRoles('AccountOwner', 'AppOwner', 'AppAdmin'), getAccountById);
router.put('/:id', protect, authorizeRoles('AccountOwner'), updateAccount);
router.delete('/:id', protect, authorizeRoles('AppOwner', 'AppAdmin'), deleteAccount);

module.exports = router;
