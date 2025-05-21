const express = require('express');
const connectDB = require('./config/db'); // الاتصال بقاعدة البيانات
const app = express();
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const reportRoutes = require('./routes/reportRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');


const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');

const cors = require('cors');

app.use(cors({
  origin: '*', // لتجربة محلية. لاحقًا يمكن تحديد النطاق بدقة
  credentials: true,
}));



// تحميل متغيرات البيئة
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

// Middleware لتحليل body
app.use(express.json());

// استيراد المسارات

// الدخول
app.use('/api/auth', authRoutes);

// الحسابات
app.use('/api/accounts', accountRoutes);

// الاشتراكات
app.use('/api/subscriptions', subscriptionRoutes);

// ملفات الرفع
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// مسارات رفع الصور
app.use('/api/upload', uploadRoutes);


// التقارير
app.use('/api/reports', reportRoutes);

// انشاء متجر
app.use('/api/stores', storeRoutes);

// ربط المسارات
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);


// المبيعات
app.use('/api/sales', saleRoutes);
// Route رئيسي
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://172.20.10.12:${PORT}`);
});

