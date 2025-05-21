const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  description: { type: String },
  category: { type: String },
  sku: { type: String },
  barcodes: [{ type: String }],
  image: { type: String },
  specifications: [
    {
      name: { type: String, required: true },
      price: { type: Number },
    }
  ],
  store: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store',
    required: true 
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
