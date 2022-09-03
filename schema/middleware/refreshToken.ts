import jwt = require("jsonwebtoken")
// import { User } from "../../generatedTypes/graphql";
import { User_i } from "../types/userType";

module.exports = (user: User_i) => {
  console.log("refresh token");
  
  return jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    // { userId: user.id },
    process.env.REFRESH as string,
    {
      expiresIn: "7d",
    }
  );
};
