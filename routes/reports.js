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

      for (const item of receipt.items) {
        const { category, subcategory, qty, price, name, addedBy, portionCost } = item;
        temptotalQtySold += qty;
        temptotalAmountSold += price;
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
          usersWithTotalPrice[addedBy] += qty * price;
        } else {
          usersWithTotalPrice[addedBy] = qty * price;
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
