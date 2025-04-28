const Store = require('../models/storeModel');

// إنشاء متجر جديد
const createStore = async (req, res) => {
  const { name, location } = req.body;

  if (!req.user || !req.user.account) {
    res.status(400);
    throw new Error('Account information missing.');
  }

  const store = await Store.create({
    name,
    location,
    account: req.user.account,
  });

  res.status(201).json(store);
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
    res.status(404);
    throw new Error('Store not found');
  }
};

// تعديل متجر
const updateStore = async (req, res) => {
  const { name, location, status } = req.body;
  const store = await Store.findById(req.params.id);

  if (store && store.account.toString() === req.user.account.toString()) {
    store.name = name || store.name;
    store.location = location || store.location;
    store.status = status || store.status;

    const updatedStore = await store.save();
    res.json(updatedStore);
  } else {
    res.status(404);
    throw new Error('Store not found');
  }
};

// حذف متجر
const deleteStore = async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (store && store.account.toString() === req.user.account.toString()) {
    await store.deleteOne();
    res.json({ message: 'Store removed' });
  } else {
    res.status(404);
    throw new Error('Store not found');
  }
};

module.exports = {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
};
