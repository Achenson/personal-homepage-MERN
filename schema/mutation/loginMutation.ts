const graphql = require("graphql");

import { Request, Response } from "express";

const {
  GraphQLString,
  GraphQLNonNull,
} = graphql;

import User = require("../../mongoModels/userSchema");

import createAccessToken = require("../middleware/accessToken");
import createRefreshToken = require("../middleware/refreshToken");
import sendRefreshToken = require("../middleware/sendRefreshToken");

import { AuthDataType } from "../types/authDataType";

interface AuthData_i {
  email_or_name: string;
  password: string;
}

interface ExpressReqRes {
  req: Request;
  res: Response;
}

export const loginMutationField = {
  // type: UserType,
  type: AuthDataType,
  args: {
    email_or_name: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(
    _source: unknown,
    { email_or_name, password }: AuthData_i,
    { req, res }: ExpressReqRes
  ) {
    let credential;

    // checking is user entered email or name
    if (email_or_name.indexOf("@") === -1) {
      credential = "name";
    } else {
      credential = "email";
    }

    // @ts-ignore
    const user = await User.findOne({ [credential]: email_or_name });
    if (!user) {
      // throw new Error("User does not exist!");
      return {
        userId: null,
        token: "User does not exist!",
      };
    }

    //   implement later!!
    /*     const isEqual = await bcrypt.compare(password, user.password);
          if (!isEqual) {
            // throw new Error("Password is incorrect!");
            return {
              userId: null,
              token: "Password is incorrect!",
            };
          }
 */

    // @ts-ignore
    sendRefreshToken(res, createRefreshToken(user));
    // @ts-ignore
    const token = createAccessToken(user);

    return { userId: user.id, token: token };
  },
};