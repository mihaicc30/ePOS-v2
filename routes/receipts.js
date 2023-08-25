require("dotenv").config();
const router = require("express").Router();
const Receipts = require("../models/receipts");
const Counter = require("../models/counter");
const Tables = require("../models/tables");
const Venues = require("../models/venues");

router.post("/areceipts", (req, res) => {
  res.status(200).send("ok");
});

// get receipts for customer app
router.post("/receipts", (req, res) => {
  try {
    Receipts.find({ email: req.body.email }).then((results) => {
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// get receipts for POS app
router.post("/receipts-pos", (req, res) => {
  try {
    Receipts.find().then((results) => {
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// add receipt
router.post("/addreceipt", async (req, res) => {
  try {
    if (req.body.from === "Customer-App") {
      console.log("Data received from customer-app.");
      const { tableNumber, venue, user, basketItems, basketTotal, basketDiscount, paymentTaken, paidin } = req.body.data;

      const queue = await Counter.findOne({ counterType: "receipt" });
      const increment = await Counter.updateOne({ counterType: "receipt" }, { $inc: { counter: 1 } });
      const venueDetails = await Venues.findOne({ id: venue });
      const totalPrice = basketItems.reduce((total, item) => total + parseFloat(item.price * item.qty), 0);
      console.log("🚀 ~ file: receipts.js:48 ~ router.post ~ totalPrice:", totalPrice);

      const receiptNumber = parseInt(String(new Date().getFullYear() + new Date().getMonth() + 1 + new Date().getDate()) + String(queue.counter));
      const vat = parseFloat(((parseFloat(totalPrice.toFixed(2)) * 20.0) / 100.0).toFixed(2));
      const subtotal = basketItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const totalAmount = parseFloat(totalPrice.toFixed(2));

      const newReceipt = new Receipts({
        items: basketItems,
        email: user.email,
        table: tableNumber,
        pubId: venue,
        pubName: venueDetails.name,
        address: venueDetails.address,
        phone: venueDetails.phone,
        website: venueDetails.website,
        receiptNumber,
        vat,
        subtotal,
        totalAmount,
        discount: basketDiscount,
        tableOpenAt: new Date().toISOString("en-GB"),
        tableClosedAt: new Date().toISOString("en-GB"),
        paymentMethod:  {
          "cash": 0,
          "card": totalAmount,
          "voucher": 0,
          "deposit": 0
        },
      });

      await newReceipt.save();
      console.log("🚀 ~ file: receipts.js:69 ~ awaitnewReceipt.save ~ results:", newReceipt);
      res.status(200).json({ message: "ok" });
    } else {
      console.log("Data received from POS-app.");
      const { tableNumber, user, venue, basketTotal, basketDiscount } = req.body;

      const queue = await Counter.findOne({ counterType: "receipt" });
      const increment = await Counter.updateOne({ counterType: "receipt" }, { $inc: { counter: 1 } });
      const table = await Tables.findOne({ tableNumber: tableNumber, tableVenue: venue });
      const venueDetails = await Venues.findOne({ id: venue });
      const checkoutTable = await Tables.deleteOne({ tableNumber: tableNumber, tableVenue: venue });
      const dateString = table.date;
      const [date, time] = dateString.split(", ");
      const [day, month, year] = date.split("/");
      const [hour, minute, second] = time.split(":");
      
      const formattedDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toISOString();

      
      new Receipts({
        items: table.basket,
        email: user.email,
        table: tableNumber,
        pubId: venue,
        pubName: venueDetails.name,
        address: venueDetails.address,
        phone: venueDetails.phone,
        website: venueDetails.website,
        receiptNumber: parseInt(String(new Date().getFullYear() + new Date().getMonth() + 1 + new Date().getDate()) + String(queue.counter)),
        vat: parseFloat(((parseFloat(basketTotal) * 20.0) / 100.0).toFixed(2)),
        subtotal: table.basket.reduce((acc, item) => {
          return acc + item.price * item.qty;
        }, 0),
        totalAmount: parseFloat(basketTotal),
        discount: basketDiscount,
        tableOpenAt: formattedDate,
        tableClosedAt: new Date().toISOString("en-GB"),
        paymentMethod: table.paidin,
      })
        .save()
        .then((results) => {
          res.status(200).json(results);
        });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
