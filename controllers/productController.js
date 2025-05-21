const Product = require('../models/productModel');
const Store = require('../models/storeModel');

// ✅ نسخ المنتجات من متجر إلى آخر
const copyProductsToAnotherStore = async (req, res) => {
  const { sourceStoreId, targetStoreId } = req.body;
  const sourceStore = await Store.findById(sourceStoreId);
  const targetStore = await Store.findById(targetStoreId);

  if (!sourceStore || !targetStore) {
    return res.status(404).json({ message: 'One or both stores not found' });
  }

  if (
    sourceStore.account.toString() !== req.user.account.toString() ||
    targetStore.account.toString() !== req.user.account.toString()
  ) {
    return res.status(403).json({ message: 'Stores do not belong to your account' });
  }

  const products = await Product.find({ store: sourceStoreId });

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
          specifications: prod.specifications, // 👈 تمت إضافته
          store: targetStoreId,
          account: req.user.account,
        });
        return await newProduct.save();
      })
    );


  res.status(201).json({ message: `${copiedProducts.length} products copied successfully.` });
};

// ✅ إنشاء منتج
const createProduct = async (req, res) => {
  const {
    name, price, quantity, description,
    category, sku, barcodes, store, image, specifications
  } = req.body;

  const role = req.user.role;
  const isStoreLevel = ['StoreAdmin', 'StoreAccountant', 'Cashier'].includes(role);

  let storeId;

  if (isStoreLevel) {
    storeId = req.user.store;
  } else {
    if (!store) return res.status(400).json({ message: 'Store is required' });
    storeId = store;
  }

  const product = await Product.create({
    name,
    price,
    quantity,
    description,
    category,
    sku,
    barcodes,
    image,
    specifications, // 👈 تمت إضافته
    store: storeId,
    account: req.user.account,
  });

  res.status(201).json(product);
};


// ✅ جلب كل المنتجات (مع فلترة حسب المتجر إن لزم)
const getProducts = async (req, res) => {
  const role = req.user.role;
  const {
    store,
    category,
    minPrice,
    maxPrice,
    search,
    barcode,             // ✅ إضافة فلترة حسب باركود
    limit = 10,
    page = 1,
    sortBy = 'createdAt', // القيمة الافتراضية للفرز
    order = 'desc',        // الاتجاه الافتراضي
  } = req.query;

  let filter = { account: req.user.account };

  // 🔐 فلترة المتجر حسب الدور
  if (['StoreAdmin', 'StoreAccountant', 'Cashier'].includes(role)) {
    filter.store = req.user.store;
  } else if (store) {
    filter.store = store;
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  // ✅ فلترة حسب الباركود إذا وُجد
  if (barcode) {
    filter.barcodes = barcode;
  }

  const perPage = parseInt(limit);
  const currentPage = parseInt(page);
  const skip = (currentPage - 1) * perPage;

  // ⚙️ إعداد الفرز
  const sortOptions = {};
  const sortField = sortBy;
  const sortOrder = order === 'asc' ? 1 : -1;
  sortOptions[sortField] = sortOrder;

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);

  res.json({
    data: products,
    meta: {
      total,
      limit: perPage,
      page: currentPage,
      totalPages: Math.ceil(total / perPage),
      sortBy,
      order,
    },
  });
};
// تحقق من الباركود 
const checkBarcode = async (req, res) => {
  try {
    const { barcode } = req.query;

    if (!barcode) {
      return res.status(400).json({ message: 'Barcode is required' });
    }

    const product = await Product.findOne({
      account: req.user.account,
      barcodes: barcode,
    });

    if (product) {
      return res.status(200).json({ exists: true, product });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('checkBarcode error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ جلب منتج محدد
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || product.account.toString() !== req.user.account.toString()) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (
    ['StoreAdmin', 'StoreAccountant', 'Cashier'].includes(req.user.role) &&
    product.store.toString() !== req.user.store.toString()
  ) {
    return res.status(403).json({ message: 'Access denied to this product' });
  }

  res.json(product);
};

// ✅ تعديل منتج
const updateProduct = async (req, res) => {
  const role = req.user.role;
  const product = await Product.findById(req.params.id);

  if (!product || product.account.toString() !== req.user.account.toString()) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (
    ['StoreAdmin', 'StoreAccountant'].includes(role) &&
    product.store.toString() !== req.user.store.toString()
  ) {
    return res.status(403).json({ message: 'Unauthorized to update this product' });
  }

  if (role === 'Cashier') {
    return res.status(403).json({ message: 'Cashier is not allowed to update products' });
  }

  const {
    name, price, quantity, description,
    category, sku, barcodes, image, specifications
  } = req.body;

  product.name = name || product.name;
  product.price = price || product.price;
  product.quantity = quantity || product.quantity;
  product.description = description || product.description;
  product.category = category || product.category;
  product.sku = sku || product.sku;
  product.barcodes = barcodes || product.barcodes;
  product.image = image || product.image;
  product.specifications = specifications || product.specifications; // 👈 تمت إضافته

  const updatedProduct = await product.save();
  res.json(updatedProduct);
};


// ✅ حذف منتج
const deleteProduct = async (req, res) => {
  const role = req.user.role;
  const product = await Product.findById(req.params.id);

  if (!product || product.account.toString() !== req.user.account.toString()) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (
    ['StoreAdmin', 'StoreAccountant'].includes(role) &&
    product.store.toString() !== req.user.store.toString()
  ) {
    return res.status(403).json({ message: 'Unauthorized to delete this product' });
  }

  if (role === 'Cashier') {
    return res.status(403).json({ message: 'Cashier is not allowed to delete products' });
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  copyProductsToAnotherStore,
  checkBarcode,
};
