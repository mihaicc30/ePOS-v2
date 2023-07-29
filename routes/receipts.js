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
  const { tableNumber, user, venue, basketTotal, basketDiscount } = req.body;
  try {
    const queue = await Counter.findOne({ counterType: "receipt" });
    const increment = await Counter.updateOne({ counterType: "receipt" }, { $inc: { counter: 1 } });
    const table = await Tables.findOne({ tableNumber: tableNumber, tableVenue: venue });
    const venueDetails = await Venues.findOne({ id: venue });
    const checkoutTable = await Tables.deleteOne({ tableNumber: tableNumber, tableVenue: venue });

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
      tableOpenAt: table.date,
      tableClosedAt: new Date().toISOString(),
      paymentMethod: table.paidin,
    })
      .save()
      .then((results) => {
        res.status(200).json(results);
      });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
