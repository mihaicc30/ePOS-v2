require("dotenv").config();
const router = require("express").Router();
const Posusers = require("../models/posusers");
const ROTA = require("../models/rota");

router.post("/fetchUserDetails", async (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v) return res.status(400).json({ error: "Missing values." });
  try {
    await Posusers.findOne({ email: req.body.email }, { pin: 0 }).then(async (results) => {
      let tempUser = {
        position: results.position,
        team: results.team,
        worktype: results.worktype,
        phone: results.phone,
        email: results.email,
        displayName: results.displayName,
      };

      let userEmail = results.email;
      let query = await ROTA.findOne({ week: req.body.week, venueID: req.body.venueID }, { roted: 1, _id: 0 });
      let tempRotedHours = 0;

      Object.values(query["roted"][userEmail]).forEach(async (staff) => {
        if (staff["roted"]?.length > 0) {
          staff["roted"].forEach((timeframe) => {
            const [startHour, startMinute] = String(timeframe.split(" - ")[0]).split(":").map(Number);
            const [endHour, endMinute] = String(timeframe).split(" - ")[1].split(":").map(Number);
            tempRotedHours += parseFloat(((endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60).toFixed(2));
          });
        }
      });
      tempUser["rotedHours"] = tempRotedHours;
      console.log("Sending user details.", new Date().toLocaleString('en-GB'));
      res.status(200).json( [tempUser] );
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/fetchUserDetails", (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v) return res.status(400).json({ error: "Missing values." });
  try {
    Posusers.findOne({ email: req.body.email }, { pin: 0 }).then((results) => {
      console.log("🚀 ~ file: posusers.js:9 ~ Posusers.find ~ results:", results);
      console.log("Sending user details.", new Date().toLocaleString('en-GB'));
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/posusers", (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v) return res.status(400).json({ error: "Missing values." });
  try {
    Posusers.find({}).then((results) => {
      console.log("Sending POS users.", new Date().toLocaleString('en-GB'));
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/updateUserDetails", async (req, res) => {
  try {
    const { oldemail, email, displayName, olddisplayName } = req.body.user;
    const query1 = await Posusers.findOne({ email: oldemail });
    const query = await Posusers.updateOne({ email: oldemail }, { $set: { email: email, displayName: displayName } });
    if (query) {
      console.log("User updated.", new Date().toLocaleString('en-GB'));
      res.status(200).json({ query, message: "ok" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/getStaffMembers", (req, res) => {
  if (!req.body.v || req.body.v !== process.env.v) return res.status(400).json({ error: "Missing values." });
  try {
    Posusers.find({ venueID: req.body.venueID }).then((results) => {
      console.log("Sending POS users.", new Date().toLocaleString('en-GB'));
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
    console.log("POS User saved.", new Date().toLocaleString('en-GB'));
    res.status(200).json({ message: "POS User saved.", user: results });
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
    console.log("POS User deleted.", new Date().toLocaleString('en-GB'));
    res.status(200).json({ message: "POS User deleted." });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
