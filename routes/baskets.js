require("dotenv").config();
const router = require("express").Router();
const Baskets = require("../models/baskets");

router.post("/abaskets", (req, res) => {
  res.status(200).send("ok")
});


router.post("/getBaskets", (req, res) => {
  res.status(200).send("ok")
});

module.exports = router;
