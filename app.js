require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended:  true }));
app.use(
  cors({
    origin: ["https://localhost","http://localhost:5173","https://localhost:5173", "https://ccwpos.web.app/"],
    methods: "GET,POST,PUT,DELETE",
  })
);


app.use("/", require("./routes/table"));
app.use("/stripe", require("./routes/stripe"));
app.use("/", require("./routes/forecast"));
app.use("/", require("./routes/baskets"));
app.use("/", require("./routes/menu"));
app.use("/", require("./routes/receipts"));
app.use("/", require("./routes/settings"));
app.use("/", require("./routes/venues"));
app.use("/", require("./routes/posusers"));
app.use("/", require("./routes/reports"));
app.use("/", require("./routes/rota"));

app.get("/", (req, res) => {
  console.log("Saying hello!");
  res.json({ hi: "Hello" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server listening at http://localhost:${process.env.PORT || 3000}`
  );
});
