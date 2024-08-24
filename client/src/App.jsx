import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Invoice from './pages/Invoice';
import ProductAdd from './pages/ProductAdd';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login';
import BarcodeGenerator from './components/BarcodeGenerator';
import PrintBarcodes from './components/PrintBarcodes';
import Footer from './components/Footer/Footer';

function App() {
  const [barcodes, setBarcodes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleGenerate = (formData) => {
    const newBarcodes = [];
    for (let i = 0; i < formData.printQty; i++) {
      newBarcodes.push({
        product: formData.product,
        productId: formData.productId,
        rate: formData.rate,
      });
    }
    setBarcodes(newBarcodes);
  };

  const handleLogin = (success) => {
    setIsAuthenticated(success);
    console.log('User authenticated:', success);
  };

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />} {/* Navbar is placed here to be shown on all routes after login */}
      <Routes>
        <Route path='/' element={<Login onLogin={handleLogin} />} />
        {isAuthenticated ? (
          <>
            <Route path='/generate-barcode' element={<BarcodeGenerator onGenerate={handleGenerate} />} />
            <Route path='/print-barcode' element={<PrintBarcodes barcodes={barcodes} />} />
            <Route path='/invoice' element={<Invoice />} />
            <Route path='/product-add' element={<ProductAdd />} />
          </>
        ) : (
          <Route path='*' element={<Navigate to='/' replace />} />
        )}
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;