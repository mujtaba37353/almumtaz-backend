const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subscription: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subscription', 
    required: true 
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
