/* const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 */

import {model, Schema} from "mongoose"
import {Settings_i} from "../schema/types/settingsType"

const SettingsSchema = new Schema<Settings_i>({
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
});

module.exports = model<Settings_i>("Settings", SettingsSchema);