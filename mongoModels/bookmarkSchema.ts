
import {model, Schema} from "mongoose"
import {BookmarkDatabase_i} from "../schema/types/bookmarkType"

const BookmarkSchema = new Schema<BookmarkDatabase_i>({
   // we don't have to pass id, because mongoDB will create it manualy
  // id: String,
  userId: String,
  title: String,
  URL: String,
  tags: [String],
  // folders: [{type: Schema.Types.ObjectId, ref: 'Tab' }]
});

module.exports = model<BookmarkDatabase_i>("Bookmark", BookmarkSchema);