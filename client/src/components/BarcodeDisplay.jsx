import React from 'react';
// import { useReactToPrint } from 'react-to-print';
const BarcodeDisplay = ({ barcode, product, rate }) => {
  return (
    <div>
      
      <p>{product}</p>
      <img
        src={barcode}
        alt="Barcode"
        style={{ width: '200px', height: 'auto' }} // Adjust width and height as needed
      />
      <p>{itemName}</p>
      <p>Rate: {rate}</p>
    </div>
  );
};

export default BarcodeDisplay;