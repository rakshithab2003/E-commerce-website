// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sellerName: String,
  email: String,
  address: String,
  phoneNumber: String,
  productName: String,
  category: String,
  price: Number,
  description: String,
  image: String,
  sellerImage: String
  
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);