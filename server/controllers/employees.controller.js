const Employee = require("../models/employess.model")

const loginEmployees = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the employee by username
      const employee = await Employee.findOne({ username });
  
      if (!employee) {
        return res.status(400).json({ message: "Invalid username or Password" });
      }
  
      // Directly compare the plain text password
      if (employee.password === password) {
        return res.status(200).json({
          message: "Login successful",
          employeeId: employee._id.toString(),
        });
      } else {
        return res.status(401).json("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json("Internal server error");
    }
  };
  
  module.exports = loginEmployees