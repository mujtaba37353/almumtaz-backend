const Account = require('../models/accountModel');
const Subscription = require('../models/subscriptionModel');
const Store = require('../models/storeModel');
const User = require('../models/userModel'); // تأكد من أن المسار صحيح

const checkAccountLimit = async (accountId, type) => {
  const account = await Account.findById(accountId).populate('subscription');

  if (!account || !account.subscription) {
    throw new Error('لم يتم العثور على الاشتراك المرتبط بالحساب.');
  }

  switch (type) {
    case 'stores': {
      const storeCount = await Store.countDocuments({ account: accountId });
      if (storeCount >= account.subscription.allowedStores) {
        throw new Error(`تم تجاوز الحد الأقصى للمتاجر في الاشتراك الحالي (${account.subscription.allowedStores})`);
      }
      break;
    }

    case 'users': {
      const userCount = await User.countDocuments({ account: accountId });
      if (userCount >= account.subscription.allowedUsers) {
        throw new Error(`تم تجاوز الحد الأقصى للمستخدمين في الاشتراك الحالي (${account.subscription.allowedUsers})`);
      }
      break;
    }

    default:
      throw new Error('نوع التحقق غير مدعوم.');
  }
};

module.exports = checkAccountLimit;
