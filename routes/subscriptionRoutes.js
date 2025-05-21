const express = require('express');
const router = express.Router();

const {
  createSubscription,
  getSubscriptions,
  getPublicSubscriptions,
  getSubscriptionById,
  getPublicSubscriptionById,
  updateSubscription,
  deleteSubscription
} = require('../controllers/subscriptionController');

const { protect } = require('../middlewares/authMiddleware');
// subscriptionRoutes.js
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.post('/', protect, authorizeRoles('AppOwner'), createSubscription);

// 🔐 صلاحيات AppOwner فقط:
router.post('/', protect, authorizeRoles('AppOwner'), createSubscription);
router.get('/', protect, authorizeRoles('AppOwner', 'AppAdmin'), getSubscriptions);
router.get('/:id', protect, authorizeRoles('AppOwner', 'AppAdmin'), getSubscriptionById);
router.put('/:id', protect, authorizeRoles('AppOwner'), updateSubscription);
router.delete('/:id', protect, authorizeRoles('AppOwner'), deleteSubscription);

// 🌐 Route عامة: الاشتراكات المتاحة للتسجيل
router.get('/public/all', getPublicSubscriptions);
router.get('/public/:id', getPublicSubscriptionById);

module.exports = router;
