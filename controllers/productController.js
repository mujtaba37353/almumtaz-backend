const Product = require('../models/productModel');
const Store = require('../models/storeModel');

// دالة لنسخ كل منتجات متجر إلى متجر آخر
const copyProductsToAnotherStore = async (req, res) => {
  const { sourceStoreId, targetStoreId } = req.body;

  // تأكد أن المتاجر موجودة وتنتمي لنفس الحساب
  const sourceStore = await Store.findById(sourceStoreId);
  const targetStore = await Store.findById(targetStoreId);

  if (!sourceStore || !targetStore) {
    res.status(404);
    throw new Error('One or both stores not found');
  }

  if (sourceStore.account.toString() !== req.user.account.toString() || targetStore.account.toString() !== req.user.account.toString()) {
    res.status(403);
    throw new Error('Stores do not belong to your account');
  }

  // جلب كل المنتجات من المتجر الأصلي
  const products = await Product.find({ store: sourceStoreId });

  // نسخ المنتجات للمتجر الجديد
  const copiedProducts = await Promise.all(
    products.map(async (prod) => {
      const newProduct = new Product({
        name: prod.name,
        price: prod.price,
        quantity: prod.quantity,
        description: prod.description,
        category: prod.category,
        sku: prod.sku,
        barcodes: prod.barcodes,
        image: prod.image,
        store: targetStoreId, // 🔥 تغيير المتجر
        account: req.user.account, // نفس الحساب
      });
      return await newProduct.save();
    })
  );

  res.status(201).json({ message: `${copiedProducts.length} products copied successfully.` });
};
// إنشاء منتج
const createProduct = async (req, res) => {
  const { name, price, quantity, description, category, sku, barcodes, store, image } = req.body;

  const product = await Product.create({
    name,
    price,
    quantity,
    description,
    category,
    sku,
    barcodes,
    store,
    image, // 🔥 هنا نربط الصورة
    account: req.user.account,
  });

  res.status(201).json(product);
};


// جلب كل المنتجات
const getProducts = async (req, res) => {
  const products = await Product.find({ account: req.user.account });
  res.json(products);
};

// جلب منتج محدد
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product && product.account.toString() === req.user.account.toString()) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// تعديل منتج
const updateProduct = async (req, res) => {
  const { name, price, quantity, description, category, sku, barcodes, image } = req.body;
  const product = await Product.findById(req.params.id);

  if (product && product.account.toString() === req.user.account.toString()) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.description = description || product.description;
    product.category = category || product.category;
    product.sku = sku || product.sku;
    product.barcodes = barcodes || product.barcodes;
    product.image = image || product.image; // 🔥 تحديث الصورة لو تم إرسالها

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};


// حذف منتج
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product && product.account.toString() === req.user.account.toString()) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  copyProductsToAnotherStore,

};




