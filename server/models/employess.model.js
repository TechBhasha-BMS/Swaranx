const mongoose = require("mongoose");

// Define the schema for the service model
const employeesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


// Create the model from the schema
const Employees = mongoose.model("Employees", employeesSchema);

module.exports = Employees;
