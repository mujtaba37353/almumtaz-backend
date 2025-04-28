const Sale = require('../models/saleModel');

// تقرير: مبيعات متجر معين
const getStoreSalesReport = async (req, res) => {
  const { storeId } = req.params;

  const sales = await Sale.find({ store: storeId, account: req.user.account });

  const totalSales = sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
  const totalDiscounts = sales.reduce((acc, sale) => acc + (sale.discount || 0), 0);
  const totalVat = sales.reduce((acc, sale) => acc + (sale.vatValue || 0), 0);

  res.json({
    storeId,
    totalSales,
    totalDiscounts,
    totalVat,
    numberOfSales: sales.length,
  });
};

// تقرير: مبيعات منتج معين
const getProductSalesReport = async (req, res) => {
  const { productId } = req.params;

  const sales = await Sale.find({ account: req.user.account, 'productsSold.product': productId });

  let totalQuantitySold = 0;
  let totalRevenue = 0;

  sales.forEach(sale => {
    sale.productsSold.forEach(item => {
      if (item.product.toString() === productId) {
        totalQuantitySold += item.quantity;
        totalRevenue += item.quantity * item.priceAtSale;
      }
    });
  });

  res.json({
    productId,
    totalQuantitySold,
    totalRevenue,
    numberOfSales: sales.length,
  });
};

module.exports = {
  getStoreSalesReport,
  getProductSalesReport,
};
