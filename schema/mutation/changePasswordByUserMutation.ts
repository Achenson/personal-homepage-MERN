import bcrypt = require("bcrypt");
import { GraphQLID, GraphQLString, GraphQLError } from "graphql";

const User = require("../../mongoModels/userSchema");
import { RequestWithAuth } from "../middleware/isAuth";

import {
  ChangePasswordByUserType,
  ChangePasswordByUser_i,
} from "../types/changePasswordByUserType";

export const changePasswordByUserMutationField = {
  type: ChangePasswordByUserType,
  args: {
    id: { type: GraphQLID },
    passwordCurrent: { type: GraphQLString },
    passwordNew: { type: GraphQLString },
  },
  async resolve(
    _source: unknown,
    { id, passwordCurrent, passwordNew }: ChangePasswordByUser_i,
    request: RequestWithAuth
  ) {
    if (!request.isAuth) {
      return new GraphQLError("Auth error");
    }

    const user = await User.findById(id);
    if (!user) {
      console.log("NO USER");

      return {
        name: null,
        error: "User does not exist",
      };
    }

    const isEqual = await bcrypt.compare(passwordCurrent, user.password);
    if (!isEqual) {
      console.log("PASSWORD INCORRECT");

      return {
        name: null,
        error: "Password is incorrect",
      };
    }

    let hashedPassword = await bcrypt.hash(passwordNew, 12);
    let update = { password: hashedPassword };
    let changedUser = await User.findByIdAndUpdate(id, update, {
      // to return updated object
      new: true,
      upsert: false, // Make this update into an upsert,
      useFindAndModify: false,
    });

    return {
      name: changedUser.name,
      error: null,
    };
  },
};
