
import {model, Schema} from "mongoose"
import {Bookmark_i} from "../schema/types/bookmarkType"

const BookmarkSchema = new Schema<Bookmark_i>({
   // we don't have to pass id, because mongoDB will create it manualy
  // id: String,
  title: String,
  URL: String,
  folderIds: [String],
  folders: [{type: Schema.Types.ObjectId, ref: 'Tab' }]
});

module.exports = model<Bookmark_i>("Bookmark", BookmarkSchema);