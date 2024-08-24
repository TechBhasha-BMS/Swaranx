
const Vendor = require('../models/products.model');
const Bill = require('../models/invoice.model');  // Ensure to use the updated Bill model

const createInvoice = async (req, res) => {
  try {
    const { customerName, customerMobile, sellPersonName, products, paymentMethod } = req.body;

    // Validate required fields
    if (!customerName || !customerMobile || !sellPersonName || !products || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let totalAmount = 0;
    const updatedProducts = products.map(product => {
      const price = parseFloat(product.price) || 0;
      const discount = parseFloat(product.discount) || 0;
      const quantity = parseFloat(product.quantity) || 0;

      // Calculate discount amount and product total
      const discountAmount = (price * discount) / 100;
      const productTotal = (price - discountAmount) * quantity;

      // CGST and SGST are fixed at 2.5% each of the productTotal but not added to the final total
      const cgstAmount = (productTotal * 2.5) / 100;
      const sgstAmount = (productTotal * 2.5) / 100;

      totalAmount += productTotal; // Add only product total to totalAmount

      return {
        ...product,
        cgstAmount,
        sgstAmount,
      };
    });

    // Increase the total amount by 5%
    const finalTotalAmount = totalAmount * 1.05;

    // Create new bill
    const newBill = new Bill({
      customerName,
      customerMobile,
      sellPersonName,
      products: updatedProducts,
      totalAmount: finalTotalAmount, // Set increased total amount
      paymentMethod,
    });

    // Save the bill to the database
    await newBill.save();

    // Update vendor quantities only after the bill is successfully saved
    await updateVendorQuantities(products);

    res.status(201).json({ message: 'Bill created successfully', bill: newBill });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ message: 'Error creating bill', error: error.message });
  }
};

// Function to update vendor quantities
const updateVendorQuantities = async (products) => {
  for (const product of products) {
    if (!product.itemName || !product.quantity) continue;

    // Find the vendor's product
    const vendor = await Vendor.findOne({ 'products.name': product.itemName });
    if (vendor) {
      const vendorProduct = vendor.products.find(p => p.name === product.itemName);
      if (vendorProduct) {
        vendorProduct.quantity -= product.quantity;

        // Ensure quantity does not drop below zero
        if (vendorProduct.quantity < 0) {
          vendorProduct.quantity = 0;
        }

        await vendor.save();
      } else {
        console.error(`Product ${product.itemName} not found in vendor's inventory`);
      }
    } else {
      console.error(`Vendor not found for product ${product.itemName}`);
    }
  }
};

module.exports = createInvoice
