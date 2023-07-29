require("dotenv").config();
const router = require("express").Router();
const Tables = require("../models/tables");
const Counter = require("../models/counter");

router.post("/atable", (req, res) => {
  res.status(200).send("ok");
});

router.post("/getTable", async (req, res) => {
  const { tableNumber, user, venue } = req.body;
  try {
    const table = await Tables.findOne({ tableNumber: tableNumber, tableVenue: venue });
    if (table) {
      if (table.tableOpen && table.tableOpenBy !== user.displayName) {
        res.status(403).json({ message: `Table is already open by ${table.tableOpenBy}.` });
      } else {
        const tableUpdate = await Tables.updateOne({ tableNumber: tableNumber, tableVenue: venue }, { $set: { tableOpen: true, tableOpenBy: user.displayName } });
        console.log(`Table ${tableNumber} exists. Sending data.`, new Date().toISOString());
        res.status(200).json(table);
      }
    } else {
      const queue = await Counter.findOne({ counterType: "queue" });
      const increment = await Counter.updateOne({ counterType: "queue" }, { $inc: { counter: 1 } });

      const newTable = new Tables({
        tableNumber: tableNumber,
        tableVenue: venue,
        tableQueueNumber: queue.counter,
        tableOpen: true,
        tableOpenBy: user.displayName,
        tableDiscount: 0,
        openBy: user.displayName,
        openByEmail: user.email,
        closedBy: false,
        closedByEmail: false,
        basket: [],
        date: new Date().toISOString(),
      });
      await newTable.save();
      console.log(`Table ${tableNumber} is created. Sending data.`, new Date().toISOString());
      res.status(200).json(newTable);
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/updateTableBasket", async (req, res) => {
  const { tableNumber, user, venue, basket, tableDiscount } = req.body;
  try {
    const table = await Tables.findOne({ tableNumber: tableNumber, tableVenue: venue });
    if (table) {
      const tableUpdate = await Tables.updateOne({ tableNumber: tableNumber, tableVenue: venue }, { $set: { basket: basket, tableDiscount: tableDiscount } });
      res.status(200).json({ message: `Table ${tableNumber} updated basket.` });
      // }
    } else {
      res.status(404).json({ message: `Table ${tableNumber} was not found.` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/addPaymentToTable", async (req, res) => {
  const { tableNumber, user, venue, type, amount } = req.body;
  try {
    const table = await Tables.findOne({ tableNumber: tableNumber, tableVenue: venue });
    if (table) {
      const updatedPaidin = { ...table.paidin };
      updatedPaidin[type] = parseFloat((parseFloat(updatedPaidin[type]) + parseFloat(amount)).toFixed(2));
      await Tables.updateOne({ tableNumber: tableNumber, tableVenue: venue }, { $set: { paidin: updatedPaidin } });
      res.status(200).json({ message: `Table ${tableNumber} updated basket.` , updatedPaidin});
    } else {
      return res.status(404).json({ message: `Table ${tableNumber} not found in venue ${venue}.` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});


router.post("/getPaidin", async (req, res) => {
  const { tableNumber, user, venue, type, amount } = req.body;
  try {
    const table = await Tables.findOne({ tableNumber: tableNumber, tableVenue: venue });
    if (table) {
      res.status(200).json({ message: `Sending Paidin data.` , table});
    } else {
      return res.status(404).json({ message: `Table ${tableNumber} not found in venue ${venue}.` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});


router.post("/leaveTable", async (req, res) => {
  const { tableNumber, user, venue } = req.body;
  try {
    if (tableNumber === "signout") {
      res.status(200).json({ message: `User logged out.` });
    } else {
      const table = await Tables.findOne({ tableNumber: tableNumber, tableVenue: venue });
      if (table) {
        const tableUpdate = await Tables.updateOne({ tableNumber: tableNumber, tableVenue: venue }, { $set: { tableOpen: false } });
        res.status(200).json({ message: `Table ${tableNumber} set free.` });
        // }
      } else {
        res.status(404).json({ message: `Table ${tableNumber} was not found.` });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
