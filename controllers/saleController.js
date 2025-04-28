const Sale = require('../models/saleModel');

// إنشاء عملية بيع
const createSale = async (req, res) => {
  const {
    store,
    productsSold,
    clientName,
    clientPhone,
    clientEmail,
    discount,
    vatType,
    vatValue,
    totalPrice,
    paymentType
  } = req.body;

  const sale = await Sale.create({
    store,
    account: req.user.account,
    user: req.user._id,
    productsSold,
    clientName,
    clientPhone,
    clientEmail,
    discount,
    vatType,
    vatValue,
    totalPrice,
    paymentType,
  });

  res.status(201).json(sale);
};

// جلب كل المبيعات لحساب المستخدم
const getSales = async (req, res) => {
  const sales = await Sale.find({ account: req.user.account })
    .populate('store', 'name')
    .populate('user', 'name email');
  res.json(sales);
};

// جلب مبيعات متجر معين
const getSalesByStore = async (req, res) => {
  const storeId = req.params.storeId;
  const sales = await Sale.find({ store: storeId, account: req.user.account })
    .populate('store', 'name')
    .populate('user', 'name email');
  
  res.json(sales);
};

module.exports = {
  createSale,
  getSales,
  getSalesByStore,
};
