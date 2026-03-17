const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("./models/Product");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ FIXED uploads path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// MongoDB
mongoose.connect("mongodb://localhost:27017/handmadeDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// add product
app.post("/add-product",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "sellerImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const product = new Product({
        sellerName: req.body.sellerName,
        email: req.body.email,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        productName: req.body.productName,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        image: req.files.image ? "/uploads/" + req.files.image[0].filename : "",
        sellerImage: req.files.sellerImage ? "/uploads/" + req.files.sellerImage[0].filename : ""
      });

      await product.save();
      res.json({ message: "Product added successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// get products
app.get("/products/:category", async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  res.json(products);
});

// delete product
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

app.listen(5000, () => console.log("Server running on 5000"));