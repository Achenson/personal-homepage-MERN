const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
   // we don't have to pass id, because mongoDB will create it manualy
  id: String,
  userId: String,
  picBackground: Boolean,
  defaultImage: String,
  oneColorForAllCols: Boolean,
  limitColGrowth: Boolean,
  hideNonDeletable: Boolean,
  disableDrag: Boolean,
  numberOfCols: Number,
});

module.exports = mongoose.model("Settings", settingsSchema);