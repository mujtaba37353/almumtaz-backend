const express = require('express');
const router = express.Router();
const  upload  = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');

// رفع صورة منتج
router.post('/product', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'لم يتم رفع أي صورة' });
  }

  res.status(200).json({
    imageUrl: `/uploads/images/${req.file.filename}`, // ✅ التعديل هنا
  });
});

// رفع صورة مستخدم
router.post('/avatar', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'لم يتم رفع أي صورة' });
  }


  res.status(200).json({
    imageUrl: `/uploads/images/${req.file.filename}`,
  });
});



module.exports = router;
