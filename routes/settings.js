require("dotenv").config();
const router=require('express').Router()


router.post("/asettings", (req, res) => {
    res.status(200).send("ok");
  });

module.exports = router;
