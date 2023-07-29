require("dotenv").config();
const router = require("express").Router();
const Posusers = require("../models/posusers");

router.post("/posusers", (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v) return res.status(400).json({ error: "Missing values." });
  try {
    Posusers.find({}).then((results) => {
      console.log("Sending POS users.", new Date().toLocaleString());
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/getStaffMembers", (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v) return res.status(400).json({ error: "Missing values." });
  try {
    Posusers.find({ venueID: req.body.venueID }).then((results) => {
      console.log("Sending POS users.", new Date().toLocaleString());
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

//register new pos user
router.post("/savePosUser", async (req, res) => {
  try {
    if (!req.body.v || req.body.v !== process.env.v) {
      return res.status(400).json({ error: "Missing values." });
    }
    const results = await new Posusers(req.body.data).save();
    console.log("POS User saved.", new Date().toLocaleString());
    res.status(200).json({ message: "POS User saved.", user:results });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/handleRemove", async (req, res) => {
  try {
    if (!req.body.v || req.body.v !== process.env.v) {
      return res.status(400).json({ error: "Missing values." });
    }
    const query = await Posusers.deleteOne({ _id: req.body.data });
    console.log("POS User deleted.", new Date().toLocaleString());
    res.status(200).json({ message: "POS User deleted." });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
