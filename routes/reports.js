require("dotenv").config();
const router = require("express").Router();
const Venues = require("../models/venues");
const TableLayout = require("../models/tablelayout");
const Targets = require("../models/targets");
const SF = require("../models/salesforecast");
const Receipts = require("../models/receipts");
const Counter = require("../models/counter");
const Tables = require("../models/tables");
const EODR = require("../models/endofdayreport");
const Products = require("../models/products");
const ROTA = require("../models/rota");

router.post("/grabNetProfit", async (req, res) => {
  const { day, month, venue } = req.body;
  // console.log("🚀 ~ file: reports.js:15 ~ router.post ~  req.body:",  req.body)
  // {
  //   Time: "07:00",✅
  //   OperatingExpenses: (700 staff wages + 1000£ rent+utilities ) / 10mins  = £17/p10m  ✅
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
            Time: new Date(FI).toLocaleTimeString("en-GB").substring(0, 5),
            OperatingExpenses: 17, // per 10mins
            GrossSales: 0,
            NetProfit: 0,
          });
        }
      }

      manipulatedResults = queryReceiptsDay.reduce((acc, receipt) => {
        const tableOpenAt = new Date(receipt.tableOpenAt);
        const tableOpenTime = tableOpenAt.toLocaleTimeString("en-GB").substring(0, 5);
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
          Date: new Date(FI).toLocaleDateString("en-GB").substring(0, 5),
          OperatingExpenses: 1700, // per day
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
            Time: new Date(FI).toLocaleTimeString("en-GB").substring(0, 5),
            Sales: 0,
          });
        }
      }

      manipulatedResults = queryReceiptsDay.reduce((acc, receipt) => {
        const tableOpenAt = new Date(receipt.tableOpenAt);
        const tableOpenTime = tableOpenAt.toLocaleTimeString("en-GB").substring(0, 5);
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
          Date: new Date(FI).toLocaleDateString("en-GB").substring(0, 5),
          Sales: 0,
        });
      }

      queryReceiptsMonth.map((receipt, index) => {
        const existingEntryIndex = manipulatedResults.findIndex((entry) => entry.Date === receipt.dateString.substring(0, 5));
        if (existingEntryIndex !== -1) {
          manipulatedResults[existingEntryIndex].Sales = parseFloat((parseFloat(manipulatedResults[existingEntryIndex].Sales) + parseFloat(receipt.totalAmount)).toFixed(2));
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

  const dayOfWeek = new Date(parseInt(day.split("/")[2]), parseInt(day.split("/")[1]) - 1, parseInt(day.split("/")[0])).toLocaleDateString("en-US", { weekday: "long" });
  // console.log("dayOfWeek", dayOfWeek);

  let now1 = new Date(parseInt(day.split("/")[2]), parseInt(day.split("/")[1]) - 1, parseInt(day.split("/")[0]));
  let startOfYear1 = new Date(now1.getFullYear(), 0, 1);
  let weekNumber1 = Math.ceil(((now1 - startOfYear1) / 86400000 + startOfYear1.getDay() + 1) / 7);
  // console.log("weekNumber1", weekNumber1);

  try {
    const receiptsOfTheDay = await Receipts.find({
      dateString: day,
      pubId: venue,
    });

    let workersOnDay = await ROTA.findOne(
      {
        week: weekNumber1,
      },
      { _id: 0, roted: 1, week: 1, weekRange: 1 }
    );

    let tempRoted = [];
    let calculateStaffMembers = 0;
    let calculateStaffMembersF = 0;
    let calculateForcastedHours = 0;
    let calculateActualHours = 0;
    let tempTotalWages = 0;
    let tempTotalWagesF = 0;

    let wages = [{ "alemihai25@gmail.com": 20 }, { "ioanaculea1992@gmail.com": 15 }, { "PetrisorPredescu2@gmail.com": 13 }, { "CristianConstantinFlorea@gmail.com": 12 }];

    Object.values(workersOnDay.roted).forEach((staff) => {
      tempRoted.push([staff.displayName, staff.email, staff[dayOfWeek].roted, staff[dayOfWeek].clocked]);
      if (staff[dayOfWeek].roted.length > 0) {
        calculateStaffMembersF++;
        staff[dayOfWeek].roted.forEach((timeframe) => {
          const [startHour, startMinute] = String(timeframe.split(" - ")[0]).split(":").map(Number);
          const [endHour, endMinute] = String(timeframe).split(" - ")[1].split(":").map(Number);
          tempTotalWagesF += parseFloat((wages.find((obj) => staff.email in obj)?.[staff.email] * parseFloat(((endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60).toFixed(2))).toFixed(2)) || 10.4;
          calculateForcastedHours += parseFloat(((endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60).toFixed(2));
        });
      }
      if (staff[dayOfWeek].clocked.length > 0) {
        calculateStaffMembers++;
        staff[dayOfWeek].clocked.forEach((timeframe2) => {
          let [startHour2, startMinute2] = String(timeframe2.split(" - ")[0]).split(":").map(Number);
          let [endHour2, endMinute2] = String(timeframe2).split(" - ")[1].split(":").map(Number);

          // in case ALL users are not logged out but still want to see the present report with the current time as a clock out time
          if(!endHour2) [endHour2,endMinute2]=[new Date().getHours('en-GB'),new Date().getMinutes('en-GB')]

          tempTotalWages += parseFloat((wages.find((obj) => staff.email in obj)?.[staff.email] * parseFloat(((endHour2 * 60 + endMinute2 - (startHour2 * 60 + startMinute2)) / 60).toFixed(2))).toFixed(2)) || 10.4;
          console.log(endHour2, endMinute2);
          calculateActualHours += parseFloat(((endHour2 * 60 + endMinute2 - (startHour2 * 60 + startMinute2)) / 60).toFixed(2));
        });
      }
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
    // console.log(calculateStaffMembers, calculateForcastedHours, calculateActualHours);
    // console.log(tempTotalWages, tempTotalWagesF);
    if (updateForecast.modifiedCount > 0) console.log(`Updated forecast for ${day} to £${temptotalAmountSold.toFixed(2)}.`);

    if (reportOfTheDay.length > 0) {
      let data = {
        totalQtySold: temptotalQtySold,
        totalAmountSold: parseFloat(temptotalAmountSold.toFixed(2)),
        totalAmountSoldNoDiscount: parseFloat(temptotalAmountSoldNoDiscount.toFixed(2)),
        totalSoldCategory: categoriesWithInfo,
        totalSoldSubcategory: subcategoriesWithInfo,
        cogsTotal: parseFloat(productsWithPortionCostTotal.toFixed(2)),
        totalSoldProducts: productsWithInfo,
        totalSoldUsers: usersWithTotalPrice,
        paymentMethod: paymentMethodsWithTotalAmount,
        totalWages: tempTotalWages,
        totalWagesF: tempTotalWagesF,
        dateString: day,
        cogs: productsWithPortionCost,
        venueID: venue,
        staffMembers: parseInt(calculateStaffMembers),
        staffMembersF: parseInt(calculateStaffMembersF),
        forcastedHours: parseFloat(calculateForcastedHours.toFixed(2)),
        actualHours: parseFloat(calculateActualHours.toFixed(2)),
        dateString: day,
        date: new Date().toISOString("en-GB"),
      };
      await EODR.updateOne(
        { dateString: day, venueID: venue },
        {
          $set: {
            totalQtySold: temptotalQtySold,
            totalAmountSold: parseFloat(temptotalAmountSold.toFixed(2)),
            totalAmountSoldNoDiscount: parseFloat(temptotalAmountSoldNoDiscount.toFixed(2)),
            totalSoldCategory: categoriesWithInfo,
            totalSoldSubcategory: subcategoriesWithInfo,
            totalSoldProducts: productsWithInfo,
            totalSoldUsers: usersWithTotalPrice,
            cogsTotal: parseFloat(productsWithPortionCostTotal.toFixed(2)),
            cogs: productsWithPortionCost,
            staffMembers: parseInt(calculateStaffMembers),
            staffMembersF: parseInt(calculateStaffMembersF),
            forcastedHours: parseFloat(calculateForcastedHours.toFixed(2)),
            actualHours: parseFloat(calculateActualHours.toFixed(2)),
            paymentMethod: paymentMethodsWithTotalAmount,
            totalWages: tempTotalWages,
            totalWagesF: tempTotalWagesF,
            dateString: day,
            venueID: venue,
            dateString: day,
            date: new Date().toISOString("en-GB"),
          },
        }
      ).then((r) => {
        res.status(200).json({ data, message: `Report created for ${day}.` });
      });
    } else {
      new EODR({
        totalQtySold: temptotalQtySold,
        totalAmountSold: parseFloat(temptotalAmountSold.toFixed(2)),
        totalAmountSoldNoDiscount: parseFloat(temptotalAmountSoldNoDiscount.toFixed(2)),
        totalSoldCategory: categoriesWithInfo,
        totalSoldSubcategory: subcategoriesWithInfo,
        totalSoldProducts: productsWithInfo,
        cogs: productsWithPortionCost,
        cogsTotal: parseFloat(productsWithPortionCostTotal.toFixed(2)),
        totalSoldUsers: usersWithTotalPrice,
        staffMembers: parseInt(calculateStaffMembers),
        staffMembersF: parseInt(calculateStaffMembersF),
        forcastedHours: parseFloat(calculateForcastedHours.toFixed(2)),
        actualHours: parseFloat(calculateActualHours.toFixed(2)),
        paymentMethod: paymentMethodsWithTotalAmount,
        totalWages: tempTotalWages,
        totalWagesF: tempTotalWagesF,
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
