import {model, Schema} from "mongoose"
import {BackgroundImgUrl_i} from "../schema/types/backgroundImgType"

const BackgroundImgUrlSchema = new Schema<BackgroundImgUrl_i>({
   // we don't have to pass id, because mongoDB will create it manualy
  userId: String,
  URL: String,
});

module.exports = model<BackgroundImgUrl_i>("BackgroundImgUrl", BackgroundImgUrlSchema);