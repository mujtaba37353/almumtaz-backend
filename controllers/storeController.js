const Store = require('../models/storeModel');
const Account = require('../models/accountModel');
const Subscription = require('../models/subscriptionModel');
const checkAccountLimit = require('../utils/accountLimits');

// إنشاء متجر جديد
const createStore = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!req.user || !req.user.account) {
      return res.status(400).json({ message: 'بيانات الحساب غير متوفرة.' });
    }

    // السماح فقط لمالك الحساب أو المحاسب العام
    if (!['AccountOwner', 'GeneralAccountant'].includes(req.user.role)) {
      return res.status(403).json({ message: 'ليس لديك صلاحية لإنشاء متجر.' });
    }

    // التحقق من الحد المسموح به من المتاجر
    await checkAccountLimit(req.user.account, 'stores');

    const store = await Store.create({
      name,
      location,
      account: req.user.account,
      status: 'active',
    });

    res.status(201).json(store);
  } catch (err) {
    console.error('Create Store Error:', err);
    res.status(500).json({ message: err.message || 'حدث خطأ أثناء إنشاء المتجر.' });
  }
};

// جلب جميع المتاجر للحساب
const getStores = async (req, res) => {
  const stores = await Store.find({ account: req.user.account });
  res.json(stores);
};

// جلب متجر معين
const getStoreById = async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (store && store.account.toString() === req.user.account.toString()) {
    res.json(store);
  } else {
    res.status(404).json({ message: 'المتجر غير موجود أو لا تملك صلاحية الوصول إليه.' });
  }
};

// تعديل متجر
const updateStore = async (req, res) => {
  try {
    const { name, location, status } = req.body;
    const store = await Store.findById(req.params.id);

    if (!store || store.account.toString() !== req.user.account.toString()) {
      return res.status(404).json({ message: 'المتجر غير موجود أو لا تملك صلاحية تعديله.' });
    }

    if (!['AccountOwner', 'GeneralAccountant'].includes(req.user.role)) {
      return res.status(403).json({ message: 'ليس لديك صلاحية تعديل المتجر.' });
    }

    store.name = name || store.name;
    store.location = location || store.location;
    store.status = status || store.status;

    const updatedStore = await store.save();
    res.json(updatedStore);
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء تعديل المتجر.' });
  }
};

// حذف متجر
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store || store.account.toString() !== req.user.account.toString()) {
      return res.status(404).json({ message: 'المتجر غير موجود أو لا تملك صلاحية حذفه.' });
    }

    if (!['AccountOwner', 'GeneralAccountant'].includes(req.user.role)) {
      return res.status(403).json({ message: 'ليس لديك صلاحية حذف المتجر.' });
    }

    await store.deleteOne();
    res.json({ message: 'تم حذف المتجر بنجاح.' });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء حذف المتجر.' });
  }
};

module.exports = {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
};
