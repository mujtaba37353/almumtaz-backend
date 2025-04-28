const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// ⚡ كل عمليات المستخدمين يجب أن يكون المستخدم محمي ومصرح له بدور Admin أو Owner

router.get('/', protect, authorizeRoles('AppOwner', 'AppAdmin'), getUsers);
router.post('/', protect, authorizeRoles('AppOwner', 'AppAdmin'), createUser);
router.put('/:id', protect, authorizeRoles('AppOwner', 'AppAdmin'), updateUser);
router.delete('/:id', protect, authorizeRoles('AppOwner', 'AppAdmin'), deleteUser);

module.exports = router;
