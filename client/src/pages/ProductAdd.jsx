import React, { useState, useEffect } from "react";

function ProductAdd() {
  const [vendorName, setVendorName] = useState("");
  const [products, setProducts] = useState([{ name: "", price: "", quantity: "" }]);
  const [gstPercentage, setGstPercentage] = useState(5); // Default GST percentage
  const [totalAmount, setTotalAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalWithGst, setTotalWithGst] = useState(0);

  // Function to calculate the total amount (sum of all products' price * quantity)
  const calculateTotal = () => {
    let total = 0;
    products.forEach((product) => {
      total += parseFloat(product.price || 0) * parseInt(product.quantity || 0, 10);
    });
    setTotalAmount(total);
  };

  // Function to calculate the GST amount based on the total amount and GST percentage
  const calculateGST = () => {
    const gst = (totalAmount * (gstPercentage / 100)).toFixed(2);
    setGstAmount(parseFloat(gst));
  };

  // Function to calculate the total amount including GST
  const calculateTotalWithGst = () => {
    const totalWithGST = (totalAmount + gstAmount).toFixed(2);
    setTotalWithGst(totalWithGST);
  };

  // Recalculate total, GST, and total with GST whenever products or GST percentage change
  useEffect(() => {
    calculateTotal();
  }, [products]);

  useEffect(() => {
    calculateGST();
  }, [totalAmount, gstPercentage]);

  useEffect(() => {
    calculateTotalWithGst();
  }, [gstAmount]);

  const handleVendorChange = (e) => {
    setVendorName(e.target.value);
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", price: "", quantity: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedVendorName = vendorName.replace(/\s+/g, "").toLowerCase();
    const formattedProducts = products.map((product) => ({
      name: product.name.replace(/\s+/g, "").toLowerCase(),
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity, 10),
    }));

    const dataToSend = {
      vendorName: formattedVendorName,
      products: formattedProducts,
      gstAmount: gstAmount, // Include GST amount in the data sent to backend
      totalWithGst: totalWithGst, // Include total amount with GST
    };

    try {
      const response = await fetch("http://localhost:3000/api/data/product-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Products added successfully");
        setVendorName("");
        setProducts([{ name: "", price: "", quantity: "" }]);
        setGstAmount(0); // Reset GST amount after successful submission
        setTotalAmount(0); // Reset total amount after successful submission
        setTotalWithGst(0); // Reset total with GST after successful submission
      } else {
        alert("Failed to add products");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <section>
        <main>
          <div className="section-product-form">
            <div className="container grid grid-two-cols">
              <div className="product-form">
                <h1 className="main-heading mb-3">Product Form</h1>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="vendorName">Vendor Name</label>
                    <input
                      type="text"
                      name="vendorName"
                      placeholder="Vendor name"
                      id="vendorName"
                      required
                      autoComplete="off"
                      value={vendorName}
                      onChange={handleVendorChange}
                    />
                  </div>

                  {products.map((product, index) => (
                    <div key={index}>
                      <label htmlFor={`name-${index}`}>Product Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Product name"
                        id={`name-${index}`}
                        required
                        autoComplete="off"
                        value={product.name}
                        onChange={(e) => handleProductChange(index, e)}
                      />

                      <label htmlFor={`price-${index}`}>Price</label>
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        id={`price-${index}`}
                        required
                        autoComplete="off"
                        value={product.price}
                        onChange={(e) => handleProductChange(index, e)}
                      />

                      <label htmlFor={`quantity-${index}`}>Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        id={`quantity-${index}`}
                        required
                        autoComplete="off"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </div>
                  ))}

                  <button type="button" className="btn btn-add-product" onClick={addProduct}>
                    Add Another Product
                  </button>

                  <div>
                    <label htmlFor="gstPercentage">GST (%)</label>
                    <input
                      type="number"
                      name="gstPercentage"
                      placeholder="GST Percentage"
                      id="gstPercentage"
                      required
                      autoComplete="off"
                      value={gstPercentage}
                      onChange={(e) => setGstPercentage(e.target.value)}
                    />
                  </div>

                  {/* Display the calculated amounts */}
                  <div>
                    <h3>Total Amount: ₹{totalAmount}</h3>
                    <h3>GST Amount: ₹{gstAmount}</h3>
                    <h3>Total Amount with GST: ₹{totalWithGst}</h3>
                  </div>

                  <button type="submit" className="btn btn-submit">
                    Submit Products
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}

export default ProductAdd;
