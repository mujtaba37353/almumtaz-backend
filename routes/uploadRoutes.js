const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');

// رفع صورة منتج
router.post('/product', protect, upload.single('image'), (req, res) => {
  res.status(200).json({
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
