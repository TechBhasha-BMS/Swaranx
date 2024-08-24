const bwipjs = require('bwip-js');

exports.generateBarcodes = async (req, res) => {
  const { product, productId, rate, barcodeQuantity } = req.body;

  const barcodeData = [];
  
  try {
    for (let i = 0; i < barcodeQuantity; i++) {
      const png = await bwipjs.toBuffer({
        bcid: 'code128',
        text: productId,
        scale: 3,
        height: 10,
        width: 40,
        includetext: true,
        textxalign: 'center',
      });

      barcodeData.push(`data:image/png;base64,${png.toString('base64')}`);
    }
    res.status(200).json({ barcodes: barcodeData, product, rate, productId });
  } catch (error) {
    console.error('Error generating barcodes:', error);
    res.status(500).json({ error: 'Error generating barcodes' });
  }
};
