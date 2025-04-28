const express = require('express');
const router = express.Router();
const { 
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription
} = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// إدارة الاشتراكات
router.post('/', protect, authorizeRoles('AppOwner'), createSubscription);
router.get('/', getSubscriptions); // يمكن لأي شخص يرى الاشتراكات العامة
router.get('/:id', getSubscriptionById);
router.put('/:id', protect, authorizeRoles('AppOwner'), updateSubscription);
router.delete('/:id', protect, authorizeRoles('AppOwner'), deleteSubscription);

module.exports = router;
