const express = require("express");
const productStore = require("../controllers/products.controler");
const createInvoice = require("../controllers/bill.controller");
const barcodeController = require('../controllers/barcode.controller');
const loginEmployees = require("../controllers/employees.controller");
const router = express.Router();

router.route('/login').post(loginEmployees)
router.post('/generateBarcodes', barcodeController.generateBarcodes);

router.route("/product-add").post(productStore)
router.route("/invoice").post(createInvoice)

module.exports = router;
