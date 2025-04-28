const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Account = require('./models/accountModel');
const Store = require('./models/storeModel');
const Product = require('./models/productModel');
const Subscription = require('./models/subscriptionModel');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // حذف البيانات القديمة
    await User.deleteMany();
    await Account.deleteMany();
    await Store.deleteMany();
    await Product.deleteMany();
    await Subscription.deleteMany();

    // إنشاء اشتراكات أساسية
    const subscriptions = await Subscription.insertMany([
      {
        name: 'Basic Plan',
        monthlyPrice: 50,
        yearlyPrice: 500,
        type: 'public',
        freeTrialDays: 14,
        allowedUsers: 5,
        allowedStores: 2,
        allowedProducts: 100,
      },
      {
        name: 'Pro Plan',
        monthlyPrice: 100,
        yearlyPrice: 1000,
        type: 'public',
        freeTrialDays: 30,
        allowedUsers: 10,
        allowedStores: 5,
        allowedProducts: 500,
      },
    ]);

    // إنشاء مستخدم AccountOwner
    const accountOwner = await User.create({
      name: 'Account Owner',
      email: 'owner@example.com',
      password: '123456',
      role: 'AccountOwner',
    });

    // إنشاء حساب مرتبط بالمستخدم
    const account = await Account.create({
      name: 'Test Company',
      owner: accountOwner._id,
      subscription: subscriptions[0]._id,
    });

    // ربط المستخدم بالحساب (لو أردنا لاحقًا)
    accountOwner.account = account._id;
    await accountOwner.save();

    // إنشاء متجر داخل الحساب
    const store = await Store.create({
      name: 'Main Branch',
      location: 'City Center',
      account: account._id,
    });

    // إنشاء منتجات داخل المتجر
    await Product.insertMany([
      {
        name: 'Coffee',
        price: 10,
        quantity: 100,
        description: 'Best Arabic Coffee',
        category: 'Drinks',
        sku: 'COF001',
        barcodes: ['1234567890'],
        store: store._id,
        account: account._id,
      },
      {
        name: 'Tea',
        price: 5,
        quantity: 150,
        description: 'Organic Green Tea',
        category: 'Drinks',
        sku: 'TEA001',
        barcodes: ['0987654321'],
        store: store._id,
        account: account._id,
      }
    ]);

    console.log('✅ Seed data inserted successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
