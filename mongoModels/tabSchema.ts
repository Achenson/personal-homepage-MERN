import {model, Schema} from "mongoose"
import {TabDatabase_i} from "../schema/types/tabType"

const TabSchema = new Schema<TabDatabase_i>({
   // we don't have to pass id, because mongoDB will create it manualy
  // id: String,
  userId: String,
  title: String,
  color: Schema.Types.Mixed,
  column: Number,
  priority: Number,
  opened: Boolean,
  openedByDefault: Boolean,
  deletable: Boolean,
  type: String,
  noteInput: Schema.Types.Mixed,
  rssLink: Schema.Types.Mixed,
  date: Schema.Types.Mixed,
  description: Schema.Types.Mixed,
  itemsPerPage: Schema.Types.Mixed,
});

module.exports = model<TabDatabase_i>("Tab", TabSchema);