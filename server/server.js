require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pruductRoute = require("./router/product.router");
const createInvoice = require("./router/product.router");
const barcodeGenrate = require("./router/product.router");
const loginEmployees =  require("./controllers/employees.controller")
const connectDB = require("./utils/db");
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/data", pruductRoute);
app.use("/api/auth", loginEmployees);
app.use("/api/data", createInvoice);
app.use("/api/data", barcodeGenrate);

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server run sucessfully on ${PORT} `);
  });
});
