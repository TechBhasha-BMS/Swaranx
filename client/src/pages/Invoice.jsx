import { useState, useRef } from 'react';

const Invoice = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [sellPersonName, setSellPersonName] = useState('');
  const [products, setProducts] = useState([{ barcode: '', itemName: '', price: '', quantity: '1', discount: '' }]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const barcodeInputRef = useRef(null); // Reference for the barcode input field

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...products];

    // Transform itemName to trim, lowercase, and remove spaces
    if (name === 'itemName') {
      newProducts[index] = { 
        ...newProducts[index], 
        [name]: value.trim().toLowerCase().replace(/\s+/g, '') 
      };
    } else {
      // Update other product details
      newProducts[index] = { ...newProducts[index], [name]: value };
    }

    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { barcode: '', itemName: '', price: '', quantity: '1', discount: '' }]);
  };

  const handleBarcodeInput = (index, e) => {
    if (e.key === 'Enter') {
      const scannedBarcode = e.target.value;
      const updatedProducts = [...products];
      updatedProducts[index] = { ...updatedProducts[index], barcode: scannedBarcode, quantity: '1' }; // Set quantity to '1'
      setProducts(updatedProducts);
      e.target.value = ''; // Clear the input field after scanning
    }
  };

  const calculateTotalAmount = () => {
    const baseTotal = products.reduce((total, product) => {
      const price = parseFloat(product.price) || 0;
      const discount = parseFloat(product.discount) || 0;
      const quantity = parseFloat(product.quantity) || 0;

      const discountAmount = (price * discount) / 100;
      const productTotal = (price - discountAmount) * quantity;

      // CGST and SGST are shown but not added to the total
      const cgst = (productTotal * 2.5) / 100;
      const sgst = (productTotal * 2.5) / 100;

      return total + productTotal;
    }, 0);

    // Increase total amount by 5%
    return baseTotal * 1.05;
  };

  const handleSubmit = async () => {
    const invoiceData = {
      customerName,
      customerMobile,
      sellPersonName,
      products: products.map(product => {
        const price = parseFloat(product.price) || 0;
        const discount = parseFloat(product.discount) || 0;
        const quantity = parseFloat(product.quantity) || 0;

        const discountAmount = (price * discount) / 100;
        const productTotal = (price - discountAmount) * quantity;

        // CGST and SGST as 2.5% each but not added to the total
        const cgstAmount = (productTotal * 2.5) / 100;
        const sgstAmount = (productTotal * 2.5) / 100;

        return {
          ...product,
          cgstAmount,
          sgstAmount,
        };
      }),
      paymentMethod,
    };

    try {
      const response = await fetch('http://localhost:3000/api/data/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create invoice: ${response.status} ${response.statusText} - ${errorData}`);
      }

      alert('Invoice created successfully!');
      window.print(); // Print invoice
      // Reset form
      setCustomerName('');
      setCustomerMobile('');
      setSellPersonName('');
      setProducts([{ barcode: '', itemName: '', price: '', quantity: '1', discount: '' }]);
      setPaymentMethod('Cash');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create invoice');
    }
  };

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <h1>Swara NX</h1>
        <h3>GST NO : 27DHMPP2514Q1ZN</h3>
      </div>
      <div className="invoice-details">
        <label>Customer Name</label>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <label>Customer Mobile</label>
        <input
          type="text"
          placeholder="Customer Mobile"
          value={customerMobile}
          onChange={(e) => setCustomerMobile(e.target.value)}
        />

        <label className="salesperson-name">Salesperson Name</label>
        <input
          type="text"
          placeholder="Salesperson Name"
          value={sellPersonName}
          onChange={(e) => setSellPersonName(e.target.value)}
        />
      </div>

      <div className="product-details">
        <h2>Product Details</h2>
        <table>
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Discount (%)</th> <br />
              <th>CGST</th> {/* CGST Column */}
              <th>SGST</th> {/* SGST Column */}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const price = parseFloat(product.price) || 0;
              const discount = parseFloat(product.discount) || 0;
              const quantity = parseFloat(product.quantity) || 0;

              const discountAmount = (price * discount) / 100;
              const productTotal = (price - discountAmount) * quantity;

              // CGST and SGST are 2.5% of productTotal but not added to total
              const cgst = 2.5;
              const sgst = 2.5

              return (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      name="barcode"
                      value={product.barcode}
                      onKeyDown={(e) => handleBarcodeInput(index, e)}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </td>
                  <td><input type="text" name="itemName" value={product.itemName} onChange={(e) => handleProductChange(index, e)} /></td>
                  <td><input type="number" name="price" value={product.price} onChange={(e) => handleProductChange(index, e)} /></td>
                  <td><input type="number" name="quantity" value={product.quantity} onChange={(e) => handleProductChange(index, e)} /></td>
                  <td><input type="number" name="discount" value={product.discount} onChange={(e) => handleProductChange(index, e)} /></td>
                  <td><input type="number" name="cgst" value={cgst.toFixed(2)} readOnly /></td>  {/* Read-Only CGST */}
                  <td><input type="number" name="sgst" value={sgst.toFixed(2)} readOnly /></td>  {/* Read-Only SGST */}
                </tr>
              );
            })}
          </tbody>
        </table>
        <button onClick={addProduct}>Add Product</button>
      </div>

      <div className="centered-section">
        <label>Total Amount: {calculateTotalAmount().toFixed(2)}</label>
        <h3>Payment Method</h3>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      <button className="no-print" onClick={handleSubmit}>Print Invoice</button>
    </div>
  );
};

export default Invoice;
