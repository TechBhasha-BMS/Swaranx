const mongoose = require("mongoose")

const URI = process.env.MONGODB_URI
const connectDB = async () => {
    try {
        await mongoose.connect(URI)
        console.log("Database connected");
        
    } catch (error) {
        console.log(`Error to connect database ${error}`);
        
    }
}

module.exports = connectDB