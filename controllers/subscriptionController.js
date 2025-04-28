const Subscription = require('../models/subscriptionModel');

// إنشاء اشتراك جديد
const createSubscription = async (req, res) => {
  const subscription = await Subscription.create(req.body);
  res.status(201).json(subscription);
};

// جلب جميع الاشتراكات
const getSubscriptions = async (req, res) => {
  const subscriptions = await Subscription.find({});
  res.json(subscriptions);
};

// جلب اشتراك معين
const getSubscriptionById = async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (subscription) {
    res.json(subscription);
  } else {
    res.status(404);
    throw new Error('Subscription not found');
  }
};

// تعديل اشتراك
const updateSubscription = async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (subscription) {
    Object.assign(subscription, req.body);
    const updatedSubscription = await subscription.save();
    res.json(updatedSubscription);
  } else {
    res.status(404);
    throw new Error('Subscription not found');
  }
};

// حذف اشتراك
const deleteSubscription = async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (subscription) {
    await subscription.deleteOne();
    res.json({ message: 'Subscription removed' });
  } else {
    res.status(404);
    throw new Error('Subscription not found');
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};
