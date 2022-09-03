import jwt = require("jsonwebtoken")
// import { User } from "../../generatedTypes/graphql";
import { User_i } from "../types/userType";

module.exports = (user: User_i) => {
  return jwt.sign(
    { userId: user.id },
    process.env.ACCESS as string,
    {
      expiresIn: "15m",
      // expiresIn: 20,
      // in ms
      // expiresIn: "10000",
    }
  );
};
