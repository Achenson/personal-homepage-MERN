import { model, Schema } from "mongoose";
import { BackgroundImg } from "../schema/types/backgroundImgType";

const BackgroundImgSchema = new Schema<BackgroundImg>({
  // we don't have to pass id, because mongoDB will create it manualy
  userId: String,
  //  img: { data: Buffer, contentType: String }
  backgroundImg: String,
});

module.exports = model("BackgroundImg", BackgroundImgSchema);
