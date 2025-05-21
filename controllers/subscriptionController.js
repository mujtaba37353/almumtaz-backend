const Subscription = require('../models/subscriptionModel');

// إنشاء اشتراك جديد (AppOwner فقط)
const createSubscription = async (req, res) => {
  const subscription = await Subscription.create(req.body);
  res.status(201).json(subscription);
};

// جلب جميع الاشتراكات (AppOwner فقط)
const getSubscriptions = async (req, res) => {
  const subscriptions = await Subscription.find({});
  res.json(subscriptions);
};

// جلب الاشتراكات العامة فقط (Public view)
const getPublicSubscriptions = async (req, res) => {
  const subscriptions = await Subscription.find({ type: 'public' });
  res.json(subscriptions);
};

// جلب اشتراك معين (AppOwner و AppAdmin فقط)
const getSubscriptionById = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (!['AppOwner', 'AppAdmin'].includes(userRole)) {
      return res.status(403).json({ message: 'Access denied. Only AppOwner or AppAdmin can view this subscription.' });
    }

    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// جلب اشتراك عام فقط
const getPublicSubscriptionById = async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  if (subscription.type !== 'public') {
    return res.status(403).json({ message: 'Access denied. Subscription is private.' });
  }

  res.status(200).json(subscription);
};


// تعديل اشتراك (AppOwner فقط)
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

// حذف اشتراك (AppOwner فقط)
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
  getPublicSubscriptions,
  getSubscriptionById,
  getPublicSubscriptionById,
  updateSubscription,
  deleteSubscription,
};
