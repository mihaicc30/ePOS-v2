require("dotenv").config();
const router = require("express").Router();
const categoriesModel = require("../models/categories");

router.post("/amenu", (req, res) => {
  res.status(200).send("ok");
});

router.post("/grabProducts", (req, res) => {
  if ( !req.body.v || req.body.v !== process.env.v)
    return res.status(400).json({ error: "Missing values." });

  try {
    categoriesModel.find({}).then((results) => {
      console.log(results);
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
