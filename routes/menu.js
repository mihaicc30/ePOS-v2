require("dotenv").config();
const router = require("express").Router();
const Products = require("../models/products");

router.post("/amenu", (req, res) => {
  res.status(200).send("ok");
});

router.post("/grabProducts", (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v) return res.status(400).json({ error: "Missing values." });

  try {
    Products.find({}).then((results) => {
      console.log("Sending products.", new Date().toUTCString());
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/updateProduct", async (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v || !req.body.product) return res.status(400).json({ error: "Missing values." });
  const { product } = req.body;

  try {
    Products.updateOne({ _id: product._id }, { $set: product }).then((results) => {
      if (results.matchedCount > 0) {
        console.log("Product update success!", new Date().toUTCString());
        res.status(200).json(results);
      } else {
        console.log("Product not found?! ", new Date().toUTCString());
        res.status(404).json({ message: "Product not found?! " });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/addNewProduct", async (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v || !req.body.product) return res.status(400).json({ error: "Missing values." });
  const { product } = req.body;
  try {
    const newProduct = new Products(product);
    const productNew = await newProduct.save();
    console.log("🚀 ~ file: menu.js:48 ~ router.post ~ productNew:", productNew);
    console.log("Product added successfully.", new Date().toUTCString());
    res.status(200).json({ message: "Product added successfully.", pid: productNew._id });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/deleteProduct", async (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v || !req.body.product) return res.status(400).json({ error: "Missing values." });
  const { product } = req.body;
  try {
    const query = await Products.deleteOne({ _id: product._id });
    console.log("Product deleted successfully.", new Date().toUTCString());
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
