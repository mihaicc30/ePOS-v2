require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
// const http = require('http');
// const server = http.createServer(app);

app.use(
  cors({
    origin: ["https://localhost", "http://localhost:5173", "https://localhost:5173", "https://ccwpos.web.app/", "https://hippos.fly.dev/"],
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  console.log(__dirname);
  console.log(__dirname+ "/routes");

app.use("/", require(__dirname + "/routes/table"));
app.use("/stripe", require(__dirname + "/routes/stripe"));
app.use("/", require(__dirname + "/routes/forecast"));
app.use("/", require(__dirname + "/routes/baskets"));
app.use("/", require(__dirname + "/routes/menu"));
app.use("/", require(__dirname + "/routes/receipts"));
app.use("/", require(__dirname + "/routes/settings"));
app.use("/", require(__dirname + "/routes/venues"));
app.use("/", require(__dirname + "/routes/posusers"));
app.use("/", require(__dirname + "/routes/reports"));
app.use("/", require(__dirname + "/routes/rota"));

app.get("/", (req, res) => {
  console.log("Saying hello!");
  res.json({ hi: "Hello" });
});

app.listen(process.env.PORT || 3000, () => console.log(`Server listening at http://localhost:${process.env.PORT || 3000}`));
