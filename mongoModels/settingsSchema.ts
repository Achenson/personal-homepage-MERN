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
  backgroundColor: String,
  folderColor: String,
  noteColor: String,
  rssColor: String,
  uiColor: String,
  colColor_1: String,
  colColor_2: String,
  colColor_3: String,
  colColor_4: String,
  colColorImg_1: String,
  colColorImg_2: String,
  colColorImg_3: String,
  colColorImg_4: String,
});

module.exports = model<SettingsDatabase_i>("Settings", SettingsSchema);
