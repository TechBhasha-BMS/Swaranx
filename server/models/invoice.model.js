const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  sellPersonName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  products: [
    {
      barcode: { type: String, required: true },
      itemName: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      cgstAmount: { type: Number, required: true },
      sgstAmount: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  addedAt: {
    type: Date,
    default: Date.now, // Automatically set to current date and time
  },
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
