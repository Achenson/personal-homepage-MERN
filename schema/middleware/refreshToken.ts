import jwt = require("jsonwebtoken")
import { User } from "../../generatedTypes/graphql";

module.exports = (user: User) => {
  return jwt.sign(
    // { userId: user.id, tokenVersion: user.tokenVersion },
    { userId: user.id },
    process.env.REFRESH as string,
    {
      expiresIn: "7d",
    }
  );
};
