let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const notificationsSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  course: {
    type: Number,
    required: true,
  },
});

var notificationsModel = mongoose.model("notifications", notificationsSchema, "notifications");

module.exports = notificationsModel;