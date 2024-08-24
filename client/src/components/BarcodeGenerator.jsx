import React, { useState, useEffect } from 'react';
import PrintBarcodes from './PrintBarcodes'; // Ensure correct import

const BarcodeGenerator = () => {
    const [product, setProduct] = useState('SWARA NX');
    const [productId, setProductId] = useState('24TBSWARA');
    const [itemName, setItemName] = useState('')
    const [rate, setRate] = useState('');
    const [barcodeQuantity, setBarcodeQuantity] = useState("");
    const [barcodes, setBarcodes] = useState([]);

    useEffect(() => {
        if (rate) {
            setProductId(`24TBSWARA${rate}`);
        } else {
            setProductId('24TBSWARA');
        }
    }, [rate]);

    const handleGenerate = async () => {
        if (!barcodeQuantity || barcodeQuantity <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/data/generateBarcodes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product,
                    productId,
                    itemName,
                    rate,
                    barcodeQuantity,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Map the barcodes to include the product information
            const barcodeData = data.barcodes.map((barcode) => ({
                image: barcode, 
                product, // Include the product name
                productId, 
                itemName,
                rate, 
            }));

            setBarcodes(barcodeData);
        } catch (error) {
            console.error('Error generating barcodes:', error);
        }
    };

    return (
        <div>
            <h1 className='bar-header'>Barcode Generator</h1>
            <input
                className='generator'
                type="text"
                placeholder="Product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
            />
            <input
                className='generator'
                type="text"
                readOnly
                placeholder="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
            />
            <input
                className='generator'
                type="text"
                placeholder="Product Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
            <input
                className='generator'
                type="text"
                placeholder="Rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
            />
            <input
                className='generator'
                type="number"
                placeholder="Quantity"
                value={barcodeQuantity}
                onChange={(e) => setBarcodeQuantity(e.target.value)
}
            />

            <br /><br />
            <button className='generator' onClick={handleGenerate}>Generate Barcodes</button>

            <PrintBarcodes barcodes={barcodes} /> {/* Pass the barcodes to PrintBarcodes */}
        </div>
    );
};

export default BarcodeGenerator;