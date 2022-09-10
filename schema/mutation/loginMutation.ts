import graphql = require("graphql");
import bcrypt = require("bcrypt");
const { GraphQLString } = graphql;

import User = require("../../mongoModels/userSchema");
const createAccessToken = require("../middleware/accessToken");
const createRefreshToken = require("../middleware/refreshToken");
const sendRefreshToken = require("../middleware/sendRefreshToken");
import { RequestWithAuth } from "../middleware/isAuth";

import { AuthDataTypeLogin } from "../types/authDataType";

interface AuthData_i {
  email_or_name: string;
  password: string;
}

export const loginMutationField = {
  type: AuthDataTypeLogin,
  args: {
    email_or_name: { type: GraphQLString },
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
      return {
        ok: false,
        userId: null,
        token: null,
        error: "User does not exist",
      };
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return {
        ok: false,
        userId: null,
        token: null,
        error: "Password is incorrect",
      };
    }

    await sendRefreshToken(res, createRefreshToken(user));
    const token = createAccessToken(user);

    return { ok: true, userId: user.id, token: token, error: null };
  },
};
