const express = require('express');
const router = express.Router();
const { 
  createStore, 
  getStores, 
  getStoreById, 
  updateStore, 
  deleteStore 
} = require('../controllers/storeController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// CRUD عمليات المتاجر
router.post('/', protect, authorizeRoles('AccountOwner', 'GeneralAccountant'), createStore);
router.get('/', protect, authorizeRoles('AccountOwner', 'GeneralAccountant'), getStores);
router.get('/:id', protect, authorizeRoles('AccountOwner', 'GeneralAccountant', 'StoreAdmin'), getStoreById);
router.put('/:id', protect, authorizeRoles('AccountOwner', 'GeneralAccountant'), updateStore);
router.delete('/:id', protect, authorizeRoles('AccountOwner'), deleteStore);

module.exports = router;
