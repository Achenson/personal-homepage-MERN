const jwt = require("jsonwebtoken");
import bcrypt = require("bcrypt");
import { GraphQLString } from "graphql";

const createAccessToken = require("../middleware/accessToken.ts");
const createRefreshToken = require("../middleware/refreshToken.ts");
const sendRefreshToken = require("../middleware/sendRefreshToken.ts");
const User = require("../../mongoModels/userSchema");

import { RequestWithAuth } from "../middleware/isAuth";

import { AuthDataType } from "../types/authDataType";

export const changePasswordAfterForgotMutationField = {
  type: AuthDataType,
  args: {
    token: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },

  async resolve(
    _source: unknown,
    args: { token: string; newPassword: string },
    { res }: RequestWithAuth
  ) {
    let decodedToken = jwt.verify(
      args.token,
      process.env.FORGOT_PASSWORD as string
    );
    let userId = decodedToken?.userId;

    if (!userId) {
      return { userId: null, token: null, error: "Invalid token provided" };
    }

    let user = await User.findById(userId);

    if (!user) {
      return { userId: null, token: null, error: "Account no longer exists" };
    }
    console.log("USER PRESENT");

    let update;
    await bcrypt
      .hash(args.newPassword, 12)
      .then((newHashedPassword: string) => {
        update = {
          password: newHashedPassword,
        };
      });

    let updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      useFindAndModify: false,
    });

    // automatically logging in
    sendRefreshToken(res, createRefreshToken(updatedUser));

    const token = createAccessToken(updatedUser);

    return { userId: updatedUser.id, token: token, error: null };
  },
};
