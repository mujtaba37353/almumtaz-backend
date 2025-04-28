const multer = require('multer');
const path = require('path');

// إعداد تخزين الملفات
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // مجلد حفظ الصور
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// فلترة الملفات (صور فقط)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = { upload };
