const Vendor = require('../models/products.model'); // Adjust the path to your model

const addProducts = async (req, res) => {
  try {
    const { vendorName, products, gstAmount, totalWithGst } = req.body;

    const newVendor = new Vendor({
      vendorName,
      products,
      gstAmount,       // Store the GST amount
      totalWithGst,    // Store the total amount including GST
    });

    await newVendor.save();
    res.status(201).send('Products added successfully');
  } catch (error) {
    res.status(500).send('Error adding products');
  }
};

module.exports = addProducts;
