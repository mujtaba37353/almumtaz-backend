const Account = require('../models/accountModel');
const User = require('../models/userModel');

// إنشاء حساب جديد
const createAccount = async (req, res) => {
    const { name, subscription } = req.body;
  
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
  
    if (!subscription) {
      res.status(400);
      throw new Error('Subscription is required');
    }
  
    const account = await Account.create({
      name,
      owner: req.user._id,
      subscription,
    });
  
    res.status(201).json(account);
  };
  

// الحصول على كل الحسابات
const getAccounts = async (req, res) => {
  const accounts = await Account.find({}).populate('owner', 'name email');
  res.json(accounts);
};

// الحصول على حساب واحد بالتفاصيل
const getAccountById = async (req, res) => {
  const account = await Account.findById(req.params.id).populate('owner', 'name email');

  if (account) {
    res.json(account);
  } else {
    res.status(404);
    throw new Error('Account not found');
  }
};

// تحديث حساب
const updateAccount = async (req, res) => {
  const { name, subscriptionType, status } = req.body;
  const account = await Account.findById(req.params.id);

  if (account) {
    account.name = name || account.name;
    account.subscriptionType = subscriptionType || account.subscriptionType;
    account.status = status || account.status;

    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } else {
    res.status(404);
    throw new Error('Account not found');
  }
};

// حذف حساب
const deleteAccount = async (req, res) => {
  const account = await Account.findById(req.params.id);

  if (account) {
    await account.deleteOne();
    res.json({ message: 'Account removed' });
  } else {
    res.status(404);
    throw new Error('Account not found');
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
