const Account = require('../models/accountModel');
const User = require('../models/userModel');

// ✅ إنشاء حساب جديد
const createAccount = async (req, res) => {
  try {
    const { name, subscription } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!subscription) {
      return res.status(400).json({ message: 'Subscription is required' });
    }

    const account = await Account.create({
      name,
      owner: req.user._id,
      subscription,
    });

    res.status(201).json(account);
  } catch (error) {
    console.error('createAccount error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ✅ الحصول على كل الحسابات (AppOwner, AppAdmin فقط)
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({})
      .populate('owner', 'name email')
      .populate('subscription', 'name');
    res.json(accounts);
  } catch (error) {
    console.error('getAccounts error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ✅ جلب حساب معين (AppOwner, AppAdmin, AccountOwner)
const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('subscription', 'name');

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const isOwner = account.owner && account.owner._id.toString() === req.user._id.toString();
    const isAdmin = ['AppOwner', 'AppAdmin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to view this account' });
    }

    res.json(account);
  } catch (error) {
    console.error('getAccountById error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ✅ تحديث حساب (AccountOwner فقط)
const updateAccount = async (req, res) => {
  try {
    const { name, subscriptionType, status } = req.body;
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this account' });
    }

    account.name = name || account.name;
    account.subscriptionType = subscriptionType || account.subscriptionType;
    account.status = status || account.status;

    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } catch (error) {
    console.error('updateAccount error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// 🔒 فقط AccountOwner يمكنه حذف الحساب المرتبط به
const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // التحقق من أن المستخدم هو AccountOwner لنفس الحساب
    const currentUser = req.user;

    const isAccountOwner =
      currentUser.role === 'AccountOwner' &&
      currentUser.account?.toString() === account._id.toString();

    if (!isAccountOwner) {
      return res.status(403).json({ message: 'Unauthorized: Only AccountOwner can delete this account' });
    }

    // 🧨 حذف كل المستخدمين والبيانات المتعلقة بالحساب
    await User.deleteMany({ account: account._id });
    await Product.deleteMany({ account: account._id });
    await Store.deleteMany({ account: account._id });
    // يمكنك إضافة المزيد حسب ما هو مرتبط بالحساب

    await account.deleteOne();

    res.json({ message: 'Account and related data deleted successfully' });
  } catch (error) {
    console.error('deleteAccount error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
