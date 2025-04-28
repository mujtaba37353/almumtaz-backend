const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
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
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productsSold: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    },
    quantity: { type: Number },
    priceAtSale: { type: Number } // السعر وقت البيع
  }],
  clientName: { type: String },
  clientPhone: { type: String },
  clientEmail: { type: String },
  discount: { type: Number, default: 0 },
  vatType: { type: String, enum: ['inclusive', 'exclusive', 'none'], default: 'none' },
  vatValue: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  paymentType: { type: String, enum: ['cash', 'credit', 'other'], default: 'cash' },
}, { timestamps: true });

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
