const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    set: function (value) {
      return value.trim().toLowerCase();
    },
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
  },
  products: {
    type: [productSchema],
    required: true,
  },
  gstAmount: {
    type: Number,
    required: true,
  },
  totalWithGst: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,  // Automatically set to current date and time
  },
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;

