require("dotenv").config();
const router = require("express").Router();
const Venues = require("../models/venues");
const TableLayout = require("../models/tableLayout");
const Targets = require("../models/targets");
const SF = require("../models/salesforecast");
const Receipts = require("../models/receipts");
const Counter = require("../models/counter");
const Tables = require("../models/tables");
const EODR = require("../models/endofdayreport");
const Products = require("../models/products");

router.post("/grabNetProfit", async (req, res) => {
  const { day, month, venue } = req.body;
  // console.log("🚀 ~ file: reports.js:15 ~ router.post ~  req.body:",  req.body)
  // {
  //   Time: "07:00",✅
  //   OperatingExpenses: (700 staff wages + 1000£ rent+utilities ) / 10mins  = £17/ph  ✅
  //   OperatingExpenses: (700 staff wages + 1000£ rent+utilities ) / 1day  = £1700/pd  ✅
  //   GrossSales: 0,
  //   NetProfit: 0,
  // },
  console.log(`Requesting ${day || month} netprofit report.`);
  try {
    if (day) {
      const queryReceiptsDay = await Receipts.find({
        dateString: { $regex: day, $options: "i" },
        pubId: venue,
      });
      if (queryReceiptsDay.length < 1) return res.json({ data: [], message: `No netprofit recorded on ${day}.` });

      let manipulatedResults = [];
      const FI = new Date("2022-01-01T07:00:00");

      for (let hour = 7; hour < 24; hour++) {
        FI.setHours(hour);
        for (let min = 0; min < 60; min += 10) {
          FI.setMinutes(min);
          manipulatedResults.push({
            Time: new Date(FI).toLocaleTimeString().substring(0, 5),
            OperatingExpenses: 17, // per 10mins
            GrossSales: 0,
            NetProfit: 0,
          });
        }
      }

      manipulatedResults = queryReceiptsDay.reduce((acc, receipt) => {
        const tableOpenAt = new Date(receipt.tableOpenAt);
        const tableOpenTime = tableOpenAt.toLocaleTimeString().substring(0, 5);
        const interval = Math.floor(tableOpenAt.getMinutes() / 10) * 10;
        const timeInterval = `${tableOpenTime.substring(0, 3)}${interval.toString().padStart(2, "0")}`;

        const existingEntryIndex = acc.findIndex((entry) => entry.Time === timeInterval);
        if (existingEntryIndex !== -1) {
          acc[existingEntryIndex].GrossSales += parseFloat(receipt.totalAmount);
        }

        return acc;
      }, manipulatedResults);

      return res.json({ data: manipulatedResults, message: `Recorded netprofit on ${day}.` });
    } else if (month) {
      const queryReceiptsMonth = await Receipts.find({
        dateString: { $regex: month, $options: "i" },
        pubId: venue,
      });
      if (queryReceiptsMonth.length < 1) return res.json({ data: [], message: `No sales recorded on ${month}.` });

      let manipulatedResults = [];
      let dateStr = `01${month}`;
      let [day, month2, year] = dateStr.split("/");
      let FI = new Date(`${year}-${month2}-${day}`);
      let theMonth = FI.getMonth();

      for (let day = 1; day <= 32; day++) {
        FI.setDate(day);
        if (FI.getMonth() !== theMonth) break;
        manipulatedResults.push({
          Date: new Date(FI).toLocaleDateString().substring(0, 5),
          OperatingExpenses: 1700,
          GrossSales: 0,
          NetProfit: 0,
        });
      }

      queryReceiptsMonth.map((receipt, index) => {
        const existingEntryIndex = manipulatedResults.findIndex((entry) => entry.Date === receipt.dateString.substring(0, 5));
        if (existingEntryIndex !== -1) {
          manipulatedResults[existingEntryIndex].GrossSales += parseFloat(receipt.totalAmount);
        }
      });
      return res.json({ data: manipulatedResults, message: `Recorded sales on ${month}.` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/grabSales", async (req, res) => {
  const { day, month, venue } = req.body;
  // console.log("🚀 ~ file: reports.js:15 ~ router.post ~  req.body:",  req.body)
  console.log(`Requesting ${day || month} sales report.`);
  try {
    if (day) {
      const queryReceiptsDay = await Receipts.find({
        dateString: { $regex: day, $options: "i" },
        pubId: venue,
      });
      if (queryReceiptsDay.length < 1) return res.json({ data: [], message: `No sales recorded on ${day}.` });

      let manipulatedResults = [];
      const FI = new Date("2022-01-01T07:00:00");

      for (let hour = 7; hour < 24; hour++) {
        FI.setHours(hour);
        for (let min = 0; min < 60; min += 10) {
          FI.setMinutes(min);
          manipulatedResults.push({
            Time: new Date(FI).toLocaleTimeString().substring(0, 5),
            Sales: 0,
          });
        }
      }

      manipulatedResults = queryReceiptsDay.reduce((acc, receipt) => {
        const tableOpenAt = new Date(receipt.tableOpenAt);
        const tableOpenTime = tableOpenAt.toLocaleTimeString().substring(0, 5);
        const interval = Math.floor(tableOpenAt.getMinutes() / 10) * 10;
        const timeInterval = `${tableOpenTime.substring(0, 3)}${interval.toString().padStart(2, "0")}`;

        const existingEntryIndex = acc.findIndex((entry) => entry.Time === timeInterval);
        if (existingEntryIndex !== -1) {
          acc[existingEntryIndex].Sales += parseFloat(receipt.totalAmount);
        }

        return acc;
      }, manipulatedResults);

      return res.json({ data: manipulatedResults, message: `Recorded sales on ${day}.` });
    } else if (month) {
      const queryReceiptsMonth = await Receipts.find({
        dateString: { $regex: month, $options: "i" },
        pubId: venue,
      });
      if (queryReceiptsMonth.length < 1) return res.json({ data: [], message: `No sales recorded on ${month}.` });

      let manipulatedResults = [];
      let dateStr = `01${month}`;
      let [day, month2, year] = dateStr.split("/");
      let FI = new Date(`${year}-${month2}-${day}`);
      let theMonth = FI.getMonth();

      for (let day = 1; day <= 32; day++) {
        FI.setDate(day);
        if (FI.getMonth() !== theMonth) break;
        manipulatedResults.push({
          Date: new Date(FI).toLocaleDateString().substring(0, 5),
          Sales: 0,
        });
      }

      queryReceiptsMonth.map((receipt, index) => {
        const existingEntryIndex = manipulatedResults.findIndex((entry) => entry.Date === receipt.dateString.substring(0, 5));
        if (existingEntryIndex !== -1) {
          manipulatedResults[existingEntryIndex].Sales += parseFloat(receipt.totalAmount);
        }
      });

      return res.json({ data: manipulatedResults, message: `Recorded sales on ${month}.` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/grabEndOfDayReport", async (req, res) => {
  const { day, venue } = req.body;
  console.log(`Requesting ${day} report.`);
  try {
    const eod = await EODR.findOne({
      dateString: day,
      venueID: venue,
    });
    if (eod) {
      res.json({ data: eod, message: "found" });
    } else {
      res.status(404).json({ message: false });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/generateEndOfDayReport", async (req, res) => {
  const { day, venue } = req.body;
  console.log(`Generating ${day} report.`);
  try {
    const receiptsOfTheDay = await Receipts.find({
      dateString: day,
      pubId: venue,
    });

    if (receiptsOfTheDay.length < 1) return res.status(200).json({ message: `No sales have been recorded on ${day}.` });

    let collectedData = new Object();
    let temptotalQtySold = 0;
    let temptotalAmountSold = 0;
    let temptotalAmountSoldNoDiscount = 0;
    const categoriesWithInfo = {};
    const subcategoriesWithInfo = {};
    const productsWithInfo = {};
    const usersWithTotalPrice = {};
    const paymentMethodsWithTotalAmount = {};
    const productsWithPortionCost = {};
    let productsWithPortionCostTotal = 0;

    for (const receipt of receiptsOfTheDay) {
      // Calculate the total amount for each payment method
      for (const [method, amount] of Object.entries(receipt.paymentMethod[0])) {
        if (paymentMethodsWithTotalAmount.hasOwnProperty(method)) {
          paymentMethodsWithTotalAmount[method] += amount;
        } else {
          paymentMethodsWithTotalAmount[method] = amount;
        }
      }

      temptotalAmountSold += parseFloat(receipt.totalAmount);

      for (const item of receipt.items) {
        const { category, subcategory, qty, price, name, addedBy, portionCost } = item;

        temptotalAmountSoldNoDiscount += price;
        temptotalQtySold += qty;
        // Calculate and update product information
        if (productsWithPortionCost.hasOwnProperty(name)) {
          productsWithPortionCost[name] += parseFloat(portionCost) || 0;
        } else {
          productsWithPortionCost[name] = parseFloat(portionCost) || 0;
        }
        productsWithPortionCostTotal += parseFloat(portionCost) || 0;

        // Calculate and update category information
        if (categoriesWithInfo.hasOwnProperty(category)) {
          categoriesWithInfo[category].qty += qty;
          categoriesWithInfo[category].totalPrice += qty * price;
        } else {
          categoriesWithInfo[category] = {
            qty,
            totalPrice: qty * price,
          };
        }

        // Calculate and update subcategory information
        if (subcategoriesWithInfo.hasOwnProperty(subcategory)) {
          subcategoriesWithInfo[subcategory].qty += qty;
          subcategoriesWithInfo[subcategory].totalPrice += qty * price;
        } else {
          subcategoriesWithInfo[subcategory] = {
            qty,
            totalPrice: qty * price,
          };
        }

        // Calculate products sold qty and sale amount
        if (productsWithInfo.hasOwnProperty(name)) {
          productsWithInfo[name].qty += qty;
          productsWithInfo[name].totalPrice += qty * price;
        } else {
          productsWithInfo[name] = {
            qty,
            totalPrice: qty * price,
          };
        }
        // Calculate user sales
        if (usersWithTotalPrice.hasOwnProperty(addedBy)) {
          usersWithTotalPrice[addedBy] += parseFloat(qty) * parseFloat(price);
        } else {
          usersWithTotalPrice[addedBy] = parseFloat(qty) * parseFloat(price);
        }
      }
    }

    // console.log("Total product qty sold:", temptotalQtySold);
    // console.log("Total product amount sold:", parseFloat((temptotalAmountSold).toFixed(2)));
    // console.log("Categories with quantity and total price:", categoriesWithInfo);
    // console.log("Subcategories with quantity and total price:", subcategoriesWithInfo);
    // console.log("Products with quantity and total price:", productsWithInfo);
    // console.log("Users with total price:", usersWithTotalPrice);
    // console.log("Products with total portion cost:", productsWithPortionCost);

    // console.log(paymentMethodsWithTotalAmount);

    const reportOfTheDay = await EODR.find({
      dateString: day,
      venueID: venue,
    });

    const updateForecast = await SF.updateOne(
      { dateRange: day, venueID: venue },
      {
        $set: {
          actual: temptotalAmountSold,
        },
      }
    );
    if (updateForecast.modifiedCount > 0) console.log(`Updated forecast for ${day} to £${temptotalAmountSold.toFixed(2)}.`);

    if (reportOfTheDay.length > 0) {
      let data = {
        totalQtySold: temptotalQtySold,
        totalAmountSold: temptotalAmountSold,
        totalAmountSoldNoDiscount: temptotalAmountSoldNoDiscount,
        totalSoldCategory: categoriesWithInfo,
        totalSoldSubcategory: subcategoriesWithInfo,
        cogsTotal: productsWithPortionCostTotal,
        totalSoldProducts: productsWithInfo,
        totalSoldUsers: usersWithTotalPrice,
        paymentMethod: paymentMethodsWithTotalAmount,
        totalWages: 700, // an temp average value simulating 6 workers/day
        dateString: day,
        cogs: productsWithPortionCost,
        venueID: venue,
        dateString: day,
        date: new Date().toISOString(),
      };
      await EODR.updateOne(
        { dateString: day, venueID: venue },
        {
          $set: {
            totalQtySold: temptotalQtySold,
            totalAmountSold: temptotalAmountSold,
            totalAmountSoldNoDiscount: temptotalAmountSoldNoDiscount,
            totalSoldCategory: categoriesWithInfo,
            totalSoldSubcategory: subcategoriesWithInfo,
            totalSoldProducts: productsWithInfo,
            totalSoldUsers: usersWithTotalPrice,
            cogsTotal: productsWithPortionCostTotal,
            cogs: productsWithPortionCost,
            paymentMethod: paymentMethodsWithTotalAmount,
            totalWages: 700, // an temp average value simulating 6 workers/day
            dateString: day,
            venueID: venue,
            dateString: day,
            date: new Date().toISOString(),
          },
        }
      ).then((r) => {
        res.status(200).json({ data, message: `Report created for ${day}.` });
      });
    } else {
      new EODR({
        totalQtySold: temptotalQtySold,
        totalAmountSold: temptotalAmountSold,
        totalAmountSoldNoDiscount: temptotalAmountSoldNoDiscount,
        totalSoldCategory: categoriesWithInfo,
        totalSoldSubcategory: subcategoriesWithInfo,
        totalSoldProducts: productsWithInfo,
        cogs: productsWithPortionCost,
        cogsTotal: productsWithPortionCostTotal,
        totalSoldUsers: usersWithTotalPrice,
        paymentMethod: paymentMethodsWithTotalAmount,
        totalWages: 700, // an temp average value simulating 6 workers/day
        dateString: day,
        venueID: venue,
      })
        .save()
        .then(async (data) => {
          res.status(200).json({ data, message: `Report created for ${day}.` });
        });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

// ----report ------
// #food sold amount
// #beverages sold amount
// #bar snackssold amount
// ----------

// # starter, main, pud, etc , soft, coffee, etc --   sold qty

// ----------

// #each product sold qty

// ----------

// #each staff member sold amount

// ----------
// gross sales
// labor cost
// fixed costs
// net profit
// etc..
