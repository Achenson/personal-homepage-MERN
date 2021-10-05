/* const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 */

import { model, Schema } from "mongoose";
import { SettingsDatabase_i } from "../schema/types/settingsType";

const SettingsSchema = new Schema<SettingsDatabase_i>({
  // we don't have to pass id, because mongoDB will create it manualy
  // id: String,
  userId: String,
  picBackground: Boolean,
  defaultImage: String,
  oneColorForAllCols: Boolean,
  limitColGrowth: Boolean,
  hideNonDeletable: Boolean,
  disableDrag: Boolean,
  numberOfCols: Number,
  date: Boolean,
  description: Boolean,
  itemsPerPage: Number,
});

module.exports = model<SettingsDatabase_i>("Settings", SettingsSchema);
