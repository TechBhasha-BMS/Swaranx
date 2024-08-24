import React from 'react';
import BarcodeDisplay from './BarcodeGenerator'; 

const PrintBarcodes = ({ barcodes }) => {

    

    return (
        <>
            <button onClick={() => window.print()}>Print</button>
            <div className='printbarcode' id="print-section">
                {barcodes.map((barcode, index) => (
                    <div key={index} className="barcode">
                        
                        <p> {barcode.product}</p>
                        <img src={barcode.image} alt={`Barcode ${index}`} />
                        <p>{barcode.itemName}</p> <p>Price: {barcode.rate}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PrintBarcodes;