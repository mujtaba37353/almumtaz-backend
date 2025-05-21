const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['AppOwner', 'AppAdmin', 'AccountOwner', 'GeneralAccountant', 'StoreAdmin', 'StoreAccountant', 'Cashier'],
    required: true
  },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
  profileImage: { type: String, default: null },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
