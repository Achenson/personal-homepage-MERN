import {model, Schema} from "mongoose"

const BackgroundImgSchema = new Schema({
    // we don't have to pass id, because mongoDB will create it manualy
   userId: String,
   img: { data: Buffer, contentType: String }
 });
 
 module.exports = model("BackgroundImg", BackgroundImgSchema);