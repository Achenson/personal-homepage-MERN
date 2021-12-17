import jwt = require("jsonwebtoken")
import { User } from "../../generatedTypes/graphql";

module.exports = (user: User) => {
  return jwt.sign(
    { userId: user.id },
    process.env.ACCESS as string,
    {
      expiresIn: "15m",
    }
  );
};
