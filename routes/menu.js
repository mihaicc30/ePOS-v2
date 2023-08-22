require("dotenv").config();
const router = require("express").Router();
const Products = require("../models/products");
const Orders = require("../models/orders");
const Counter = require("../models/counter");

router.post("/amenu", (req, res) => {
  res.status(200).send("ok");
});

router.post("/recallOrder", async (req, res) => {
  try {
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;
    const gbDate = new Date(date.getTime() - offset).toISOString();

    const results = await Orders.updateOne({ _id: req.body.data }, { $set: { orderStatus: "todo", date: gbDate, dateTime: new Date().toLocaleTimeString('en-GB') } });
    console.log("Order recalled.", new Date().toUTCString());
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/zapOrder", async (req, res) => {
  try {
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;
    const gbDate = new Date(date.getTime() - offset).toISOString();

    const results = await Orders.updateOne({ _id: req.body.data }, { $set: { orderStatus: "zapped", date: gbDate, dateTime: new Date().toLocaleTimeString('en-GB') } });
    console.log("Order zapped!", new Date().toUTCString());
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/fetchAllOrders", async (req, res) => {
  try {
    const results = await Orders.find({ venueID: req.body.data.venueID, orderType: req.body.data.orderType }).sort({ dateTime: 1 });
    res.status(200).json(results);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
router.post("/fetchZapped", async (req, res) => {
  try {
    const results = await Orders.find({ venueID: req.body.data.venueID, orderType: req.body.data.orderType, orderStatus: "zapped", dateString: req.body.data.dateString }).sort({ dateTime: 1 });
    res.status(200).json(results);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
router.post("/fetchOrders", async (req, res) => {
  try {
    const results = await Orders.find({ venueID: req.body.data.venueID, orderType: req.body.data.orderType, orderStatus: "todo", dateString: `${new Date().toLocaleDateString("en-GB")}` }).sort({ dateTime: 1 });
    res.status(200).json(results);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/addOrder", async (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v) return res.status(400).json({ error: "Missing values." });
  try {
    let data = req.body.data;
    data.dateTime = new Date().toLocaleTimeString('en-GB')
    data.dateString = new Date().toLocaleDateString('en-GB')
    const queue = await Counter.findOne({ counterType: "print" });
    const increment = await Counter.updateOne({ counterType: "print" }, { $inc: { counter: 1 } });
    data["queueNumber"] = queue.counter;
    new Orders(data).save().then(async (r) => {
      console.log("Order has been added.", new Date().toUTCString());
      res.status(200).json(r);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
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
  let { product } = req.body;

  // failsafe
  if (product.portionCost === 0) {
    product.portionCost = parseFloat((product.price / 4).toFixed(2));
  }

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
