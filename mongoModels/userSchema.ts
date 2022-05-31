import { model, Schema } from "mongoose";

import {User_i} from "../schema/types/userType"

const UserSchema = new Schema<User_i>({
  // we don't have to pass id, because mongoDB will create it manualy
  //   id: String,
  name: String,
  email: String,
  password: String,
  tokenVersion: Number
 /*  settings: { type: Schema.Types.ObjectId, ref: 'Settings' },
  tabs: [{type: Schema.Types.ObjectId, ref: 'Tab' }],
  bookmarks: [{type: Schema.Types.ObjectId, ref: 'Bookmark' }] */
});

module.exports = model<User_i>("User", UserSchema);
