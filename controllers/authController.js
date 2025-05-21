const User = require('../models/userModel');
const Account = require('../models/accountModel');
const Subscription = require('../models/subscriptionModel');
const generateToken = require('../config/jwt');


// ✅ تسجيل مستخدم وإنشاء حساب جديد مرتبط باشتراك
const registerAccount = async (req, res) => {
  try {
    const { name, email, password, accountName, subscriptionId } = req.body;

    if (!name || !email || !password || !accountName || !subscriptionId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription || subscription.type !== 'public') {
      return res.status(400).json({ message: 'Invalid or private subscription' });
    }

    // 👤 أولًا: أنشئ المستخدم بدون account
    const user = await User.create({
      name,
      email,
      password,
      role: 'AccountOwner',
    });

    // 🧾 ثم أنشئ الحساب باستخدام user._id كـ owner
    const account = await Account.create({
      name: accountName,
      subscription: subscription._id,
      owner: user._id,
    });

    // 🔗 أخيرًا: حدّث المستخدم ليكون مربوطًا بالحساب
    user.account = account._id;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Account created and user registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        account: user.account,
      },
    });
  } catch (err) {
    console.error('❌ registerAccount error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};


// تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};

// تسجيل دخول مستخدم
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

// جلب الملف الشخصي
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = { registerAccount, registerUser, loginUser, getProfile };
