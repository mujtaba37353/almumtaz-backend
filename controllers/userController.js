const User = require('../models/userModel');
const Account = require('../models/accountModel'); // ✅ إضافة مهمة
const checkAccountLimit = require('../utils/accountLimits');

// ✅ جلب المستخدمين حسب الدور
const getUsers = async (req, res) => {
  const currentUser = req.user;
  let filter = {};

  if (['AppOwner', 'AppAdmin'].includes(currentUser.role)) {
    filter.role = { $in: ['AppAdmin', 'AccountOwner'] };
  } else if (['AccountOwner', 'GeneralAccountant'].includes(currentUser.role)) {
    filter.account = currentUser.account;
  } else if (currentUser.role === 'StoreAdmin') {
    filter.store = currentUser.store;
    filter.role = { $in: ['StoreAccountant', 'Cashier'] };
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }

  const users = await User.find(filter);
  res.json(users);
};

// ✅ إنشاء مستخدم جديد حسب الدور

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, subscription, store } = req.body;
    const currentUser = req.user;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let newUserData = {
      name,
      email,
      password,
      role,
    };

    let createdUser;

    // 👑 AppOwner & AppAdmin
    if (['AppOwner', 'AppAdmin'].includes(currentUser.role)) {
      createdUser = await User.create(newUserData);

      if (role === 'AccountOwner') {
        if (!subscription) {
          return res.status(400).json({ message: 'Subscription is required for AccountOwner' });
        }

        const newAccount = await Account.create({
          name: `${name}'s Account`,
          owner: createdUser._id,
          subscription,
        });

        createdUser.account = newAccount._id;
        await createdUser.save();
      }
    }

    // 📦 AccountOwner & GeneralAccountant
    else if (['AccountOwner', 'GeneralAccountant'].includes(currentUser.role)) {
      if (role === 'AccountOwner') {
        return res.status(403).json({ message: 'You cannot create another AccountOwner' });
      }

      await checkAccountLimit(currentUser.account, 'users');

      newUserData.account = currentUser.account;

          if (['StoreAdmin', 'StoreAccountant', 'Cashier'].includes(role)) {
          if (currentUser.role === 'StoreAdmin') {
            newUserData.store = currentUser.store;
          } else if (req.body.store) {
            newUserData.store = req.body.store;
          } else {
            newUserData.store = null; // ← يسمح بعدم وجود متجر وقت الإنشاء
          }
        }


      createdUser = await User.create(newUserData);
    }

    // 🏪 StoreAdmin
    else if (currentUser.role === 'StoreAdmin') {
      if (!['StoreAccountant', 'Cashier'].includes(role)) {
        return res.status(403).json({ message: 'StoreAdmin can only create StoreAccountant or Cashier' });
      }

      newUserData.store = currentUser.store;
      newUserData.account = currentUser.account;
      createdUser = await User.create(newUserData);
    }

    else {
      return res.status(403).json({ message: 'Unauthorized to create user' });
    }

    res.status(201).json(createdUser);
  } catch (error) {
    console.error('createUser error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// ✅ تحديث مستخدم
const updateUser = async (req, res) => {
  const currentUser = req.user;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isSameAccount = user.account?.toString() === currentUser.account?.toString();
  const isSameStore = user.store?.toString() === currentUser.store?.toString();

  const canUpdate =
    ['AppOwner', 'AppAdmin'].includes(currentUser.role) ||
    (['AccountOwner', 'GeneralAccountant'].includes(currentUser.role) && isSameAccount) ||
    (currentUser.role === 'StoreAdmin' && isSameStore && ['StoreAccountant', 'Cashier'].includes(user.role));

  if (!canUpdate) {
    res.status(403);
    throw new Error('Unauthorized to update this user');
  }

  const { name, email, role, status } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.status = status || user.status;

  const updatedUser = await user.save();
  res.json(updatedUser);
};

// ✅ حذف مستخدم
const deleteUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ حظر حذف مالك الحساب من أي طرف
    if (user.role === 'AccountOwner') {
      return res.status(403).json({ message: 'Cannot delete AccountOwner' });
    }

    const isSameAccount = user.account?.toString() === currentUser.account?.toString();
    const isSameStore = user.store?.toString() === currentUser.store?.toString();

    let canDelete = false;

    if (currentUser.role === 'AccountOwner') {
      // يمكنه حذف من داخل حسابه فقط
      canDelete = isSameAccount;
    }

    else if (currentUser.role === 'GeneralAccountant') {
      // يمكنه حذف من داخل حسابه فقط (لكن لا يستطيع حذف مالك الحساب وهو محمي أعلاه)
      canDelete = isSameAccount;
    }

    else if (currentUser.role === 'StoreAdmin') {
      // يمكنه حذف StoreAccountant أو Cashier في نفس المتجر فقط
      canDelete = isSameStore && ['StoreAccountant', 'Cashier'].includes(user.role);
    }

    else if (currentUser.role === 'AppOwner') {
      // يمكنه فقط حذف AppAdmin
      canDelete = user.role === 'AppAdmin';
    }

    if (!canDelete) {
      return res.status(403).json({ message: 'Unauthorized to delete this user' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });

  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// ✅ ايجاد يوزر بالاي دي حقه
const getUserById = async (req, res) => {
  try {
    const currentUser = req.user;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isSameAccount = user.account?.toString() === currentUser.account?.toString();
    const isSameStore = user.store?.toString() === currentUser.store?.toString();

    const canView =
      ['AppOwner', 'AppAdmin'].includes(currentUser.role) ||
      (['AccountOwner', 'GeneralAccountant'].includes(currentUser.role) && isSameAccount) ||
      (currentUser.role === 'StoreAdmin' && isSameStore && ['StoreAccountant', 'Cashier'].includes(user.role));

    if (!canView) {
      return res.status(403).json({ message: 'Unauthorized to view this user' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('getUserById error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// ✅ تحديث المستخدم الحالي
const updateCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, email, password, profileImage } = req.body;

    if (username) user.name = username; // ← مهم جداً
    if (email) user.email = email;
    if (password) user.password = password;
    if (profileImage) user.profileImage = profileImage;

    const updated = await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user: updated });
  } catch (error) {
    console.error('updateCurrentUser error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

//ربط مستخدم بمتجر
const assignUserToStore = async (req, res) => {
  try {
    const { storeId } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // فقط مالك الحساب أو المحاسب العام من نفس الحساب يمكنه الربط
    const currentUser = req.user;
    if (!['AccountOwner', 'GeneralAccountant'].includes(currentUser.role) ||
        user.account?.toString() !== currentUser.account?.toString()) {
      return res.status(403).json({ message: 'Unauthorized to assign user to store' });
    }

    user.store = storeId;
    await user.save();

    res.json({ message: 'User assigned to store successfully', user });
  } catch (error) {
    console.error('assignUserToStore error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

//إزالة المستخدم من المتجر
const removeUserFromStore = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = req.user;
    if (!['AccountOwner', 'GeneralAccountant'].includes(currentUser.role) ||
        user.account?.toString() !== currentUser.account?.toString()) {
      return res.status(403).json({ message: 'Unauthorized to remove user from store' });
    }

    user.store = null;
    await user.save();

    res.json({ message: 'User removed from store successfully', user });
  } catch (error) {
    console.error('removeUserFromStore error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};




module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  updateCurrentUser,
  assignUserToStore,
  removeUserFromStore,
};
