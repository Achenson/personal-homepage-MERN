import { model, Schema } from "mongoose";

import {User_i} from "../schema/types/userType"

const UserSchema = new Schema<User_i>({
  // we don't have to pass id, because mongoDB will create it manualy
  //   id: String,
  name: String,
  email: String,
  password: String,
});

module.exports = model<User_i>("User", UserSchema);
