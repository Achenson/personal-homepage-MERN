import graphql = require("graphql");
import bcrypt = require("bcrypt");

import { Request, Response } from "express";

const { GraphQLString, GraphQLNonNull } = graphql;

import User = require("../../mongoModels/userSchema");

const createAccessToken = require("../middleware/accessToken");
const createRefreshToken = require("../middleware/refreshToken");
const sendRefreshToken = require("../middleware/sendRefreshToken");

import { AuthDataType } from "../types/authDataType";

import { RequestWithAuth } from "../middleware/isAuth";

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
    // email_or_name: { type: new GraphQLNonNull(GraphQLString) },
    email_or_name: { type: GraphQLString },
    // password: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
  },

  async resolve(
    _source: unknown,
    { email_or_name, password }: AuthData_i,
    { res }: RequestWithAuth
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
        token: null,
        error: "User does not exist",
      };
    }

    //   implement later!!
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      // throw new Error("Password is incorrect!");
      return {
        userId: null,
        token: null,
        error: "Password is incorrect",
      };
    }

    sendRefreshToken(res, createRefreshToken(user));

    const token = createAccessToken(user);

    // console.log("token");
    // console.log(token);
    

    return { userId: user.id, token: token, error: null };
  },
};
