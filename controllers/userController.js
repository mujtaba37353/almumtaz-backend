const User = require('../models/userModel');

// الحصول على كل المستخدمين
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// إنشاء مستخدم جديد
const createUser = async (req, res) => {
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

  res.status(201).json(user);
};

// تحديث مستخدم
const updateUser = async (req, res) => {
  const { name, email, role, status } = req.body;

  const user = await User.findById(req.params.id);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// حذف مستخدم
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne(); // ✅ التصحيح هنا بدل remove()
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};


module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
