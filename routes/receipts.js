require("dotenv").config();
const router = require("express").Router();
const receiptModel = require("../models/receipts");
const counterModel = require("../models/counter");

router.post("/areceipts", (req, res) => {
  res.status(200).send("ok");
});

// get receipts
router.post("/receipts", (req, res) => {
  try {
    receiptModel.find({ email: req.body.email }).then((results) => {
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// add receipt
router.post("/addreceipt",  async (req, res) => {
  if (req.body?.v !== process.env.v) {
    res.status(403).json({ err: "key not valid" });
    return;
  }
  try {
    counterModel
      .updateOne({}, { $inc: { counter: 1 } })
      .then((updateResult) => {
        return counterModel.findOne();
      })
      .then((updatedCounter) => {
        if (updatedCounter) {
          req.body.receipt.receiptNumber = updatedCounter.counter

          new receiptModel(req.body.receipt)
            .save({ email: req.body.email })
            .then((results) => {
              res.status(200).json(results);
            });
        } else {
          console.log("Counter document not found");
        }
      });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
