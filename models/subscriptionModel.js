const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  monthlyPrice: { type: Number, required: true },
  yearlyPrice: { type: Number, required: true },
  type: { type: String, enum: ['public', 'private'], required: true },
  freeTrialDays: { type: Number, default: 0 },
  allowedUsers: { type: Number, required: true },
  allowedStores: { type: Number, required: true },
  allowedProducts: { type: Number, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
