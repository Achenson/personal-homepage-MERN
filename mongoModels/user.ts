// no need to pass those as they are in settings already?
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
// we don't have to pass id, because mongoDB will create it manualy
//   id: String,
  name: String,
  email: String,
  password: String
});

module.exports = mongoose.model("User", userSchema);