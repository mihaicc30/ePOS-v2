require("dotenv").config();
const router = require("express").Router();
const Venues = require("../models/venues");
const TableLayout = require("../models/tablelayout");

router.post("/avenues", (req, res) => {
  res.status(200).send("ok");
});

router.post("/grabVenues", (req, res) => {
  try {
    Venues.find({}).then((results) => {
      console.log("Sending venues.", new Date().toUTCString());
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/grabTableLayout", (req, res) => {
  try {
    TableLayout.findOne({ fromvenueid: req.body.fromvenueid }).then((results) => {
      console.log("Sending table layout.", new Date().toUTCString());
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/saveTableLayout", (req, res) => {
  try {
    TableLayout.updateOne({ fromvenueid: req.body.data.venueID }, { $set: { layout: req.body.data.tb.layout, gridSize: req.body.data.tb.gridSize } }).then((results) => {
      console.log("🚀 ~ file: venues.js:39 ~ TableLayout.updateOne ~ results:", results)
      console.log("Sending table layout.", new Date().toUTCString());
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
