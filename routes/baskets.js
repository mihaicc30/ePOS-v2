require("dotenv").config();
const router = require("express").Router();

router.post("/abaskets", (req, res) => {
  res.status(200).send("ok")
});

module.exports = router;
