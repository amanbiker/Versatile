const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
    unique: true,
  },
  
});

module.exports = mongoose.model("Product", productSchema);
