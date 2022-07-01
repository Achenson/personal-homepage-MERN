const jwt = require("jsonwebtoken");
import { User_i } from "../types/userType";

module.exports = (user: User_i) => {
  return jwt.sign(
    { userId: user.id },
    process.env.FORGOT_PASSWORD,
    {
      expiresIn: "15m",
    }
  );
};
