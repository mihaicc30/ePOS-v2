require("dotenv").config();
const router = require("express").Router();
const ROTA = require("../models/rota");
const Posusers = require("../models/posusers");

router.post("/handleClocked", async (req, res) => {
  console.log(req.body);
  try {
    let query = await ROTA.findOne({ week: req.body.week, venueID: req.body.venueID });
    console.log(`Looking for ${req.body.week} ${req.body.email}`);
    if (query) {
      let rotedData = query.roted;
      let tempData = query.roted[`${req.body.email}`][`${req.body.typeOfDay}`][`clocked`];
      if (tempData.length < 1) {
        rotedData[`${req.body.email}`][`${req.body.typeOfDay}`][`clocked`].push(`${new Date().toLocaleTimeString().substring(0, 5)} - ?`);
        let query2 = await ROTA.updateOne({ week: req.body.week, venueID: req.body.venueID }, { $set: { roted: rotedData } });
        return res.status(200).json({ message: `${rotedData[`${req.body.email}`].displayName} has been clocked in.` });
      } else if (tempData.length >= 1) {
        let lastEntry = tempData[tempData.length - 1];
        let startTime = lastEntry.split(" - ")[0];
        let endTime = lastEntry.split(" - ")[1];
        if (endTime === "?") {
          endTime = new Date().toLocaleTimeString().substring(0, 5);
          tempData[tempData.length - 1] = `${startTime} - ${endTime}`;
          rotedData[`${req.body.email}`][`${req.body.typeOfDay}`][`clocked`] = tempData;
          let query3 = await ROTA.updateOne({ week: req.body.week, venueID: req.body.venueID }, { $set: { roted: rotedData } });
          return res.status(200).json({ message: `${rotedData[`${req.body.email}`].displayName} has been clocked out.` });
        } else if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(endTime)) {
          rotedData[`${req.body.email}`][`${req.body.typeOfDay}`][`clocked`].push(`${new Date().toLocaleTimeString().substring(0, 5)} - ?`);
          let query4 = await ROTA.updateOne({ week: req.body.week, venueID: req.body.venueID }, { $set: { roted: rotedData } });
          return res.status(200).json({ message: `${rotedData[`${req.body.email}`].displayName} has been clocked in.` });
        } else {
          console.log(tempData);
          console.log("Usr has some wierd data?! Do investigate logs.");
          return res.status(400).json({ message: `Error. Do investigate logs.` });
        }
      }
    }
    console.log("User ROTA data has been updated.", new Date().toLocaleString());
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/resetRota", async (req, res) => {
  try {
    let tempMonth = parseInt(req.body.weekRange.split(" - ")[0].split("/")[1]);
    let tempYear = parseInt(req.body.weekRange.split(" - ")[0].split("/")[2]);

    const entry = new ROTA({
      week: req.body.week,
      weekRange: req.body.weekRange,
      month: tempMonth,
      year: tempYear,
      venueID: req.body.venueID,
      roted: {},
    });

    let q2 = await Posusers.find({ venueID: req.body.venueID, isAdmin: false }, { _id: 0, email: 1, displayName: 1, team: 1 });

    q2.forEach(async (usr) => {
      entry.roted[usr.email] = {
        displayName: usr.displayName,
        team: usr.team,
        email: usr.email,
        Sunday: {
          roted: [],
          clocked: [],
          requests: [],
        },
        Monday: {
          roted: [],
          clocked: [],
          requests: [],
        },
        Tuesday: {
          roted: [],
          clocked: [],
          requests: [],
        },
        Wednesday: {
          roted: [],
          clocked: [],
          requests: [],
        },
        Thursday: {
          roted: [],
          clocked: [],
          requests: [],
        },
        Friday: {
          roted: [],
          clocked: [],
          requests: [],
        },
        Saturday: {
          roted: [],
          clocked: [],
          requests: [],
        },
      };
    });
    let query = await ROTA.updateOne(
      { week: req.body.week, venueID: req.body.venueID, weekRange: req.body.weekRange },
      {
        $set: {
          week: entry.week,
          weekRange: entry.weekRange,
          month: entry.month,
          year: entry.year,
          roted: entry.roted,
          venueID: entry.venueID,
        },
      }
    );

    console.log("Sending empty roted data.", new Date().toLocaleString());
    res.status(200).json(entry.roted);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/updateRota", async (req, res) => {
  try {
    let query = await ROTA.updateOne({ week: req.body.week, venueID: req.body.venueID, weekRange: req.body.weekRange }, { $set: { roted: req.body.data } });
    console.log(query);
    console.log("ROTA has been updated.", new Date().toLocaleString());
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/getRotaOfTheWeek", async (req, res) => {
  try {
    let query = await ROTA.findOne({ week: req.body.week, venueID: req.body.venueID });
    if (query) {
      console.log("Sending roted data.", new Date().toLocaleString());
      res.status(200).json(query.roted);
    } else {
      let tempMonth = parseInt(req.body.weekRange.split(" - ")[0].split("/")[1]);
      let tempYear = parseInt(req.body.weekRange.split(" - ")[0].split("/")[2]);

      const entry = new ROTA({
        week: req.body.week,
        weekRange: req.body.weekRange,
        month: tempMonth,
        year: tempYear,
        venueID: req.body.venueID,
        roted: {},
      });

      let q2 = await Posusers.find({ venueID: req.body.venueID, isAdmin: false }, { _id: 0, email: 1, displayName: 1, team: 1 });

      q2.forEach(async (usr) => {
        entry.roted[usr.email] = {
          displayName: usr.displayName,
          team: usr.team,
          email: usr.email,
          Sunday: {
            roted: [],
            clocked: [],
            requests: [],
          },
          Monday: {
            roted: [],
            clocked: [],
            requests: [],
          },
          Tuesday: {
            roted: [],
            clocked: [],
            requests: [],
          },
          Wednesday: {
            roted: [],
            clocked: [],
            requests: [],
          },
          Thursday: {
            roted: [],
            clocked: [],
            requests: [],
          },
          Friday: {
            roted: [],
            clocked: [],
            requests: [],
          },
          Saturday: {
            roted: [],
            clocked: [],
            requests: [],
          },
        };
      });

      await entry.save();
      console.log("Sending empty roted data.", new Date().toLocaleString());
      res.status(200).json(entry.roted);
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

// const entry = new ROTA({
//   "week": req.body.week,
//   "weekRange": "31/7/2023 - 6/8/2023",
//   "month": 8,
//   "year": 2023,
//   "day": 4,
//   "roted": {
//     "alemihai25@gamil2.com": {
//       "displayName": "Mihai Culea Manager",
//       "team": "Management",
//       "email": "alemihai25@gamil2.com",
//       "Sunday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       },
//       "Tuesday": {
//         "roted": [
//           "HOLIDAY"
//         ],
//         "clocked": [],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       },
//       "Wednesday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       }
//     },
//     "ioanaculea1992@gmail.com": {
//       "displayName": "Ioana Culea",
//       "team": "Management",
//       "email": "ioanaculea1992@gmail.com",
//       "Sunday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       },
//       "Tuesday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       },
//       "Wednesday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       }
//     },
//     "PetrisorPredescu2@gmail.com": {
//       "displayName": "Petrisor Predescu",
//       "team": "Staff",
//       "email": "PetrisorPredescu2@gmail.com",
//       "Sunday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       },
//       "Tuesday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       },
//       "Wednesday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       }
//     },
//     "CristianConstantinFlorea@gmail.com": {
//       "displayName": "Cristian Constantin Florea",
//       "team": "Staff",
//       "email": "CristianConstantinFlorea@gmail.com",
//       "Sunday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       },
//       "Tuesday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       },
//       "Wednesday": {
//         "roted": [
//           "12:00 - 15:00",
//           "18:00 - 22:00"
//         ],
//         "clocked": [
//           "11:59",
//           "15:10",
//           "17:50",
//           "21:35"
//         ],
//         "requests": [
//           {
//             "id": 1,
//             "request": "OFF",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 2,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "yes"
//           },
//           {
//             "id": 3,
//             "request": "OFF",
//             "message": "Exam Day",
//             "status": "no"
//           },
//           {
//             "id": 4,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": ""
//           },
//           {
//             "id": 5,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "yes"
//           },
//           {
//             "id": 6,
//             "request": "HOLIDAY",
//             "message": "",
//             "status": "no"
//           },
//           {
//             "id": 7,
//             "request": "CUSTOM",
//             "message": "Hey Custom Message?!",
//             "status": "no"
//           }
//         ]
//       }
//     }
//   },
//   "dateString": "04/08/2023",
//   "date": {
//     "$date": "2023-08-04T14:56:09.695Z"
//   },
// });
