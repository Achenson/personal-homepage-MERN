const User = require("../../mongoModels/userSchema");
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

// import { UserFields, UserType, User_i } from "../types/userType";
import {
  ChangePasswordByUserType,
  ChangePasswordByUser_i,
} from "../types/changePasswordByUserType";

const bcrypt = require("bcrypt");

export const changePasswordByUserMutationField = {
  type: ChangePasswordByUserType,
  args: {
    id: { type: GraphQLID },

    // password: { type: new GraphQLNonNull(GraphQLString) },
    passwordCurrent: { type: GraphQLString },
    passwordNew: { type: GraphQLString },
  },
  async resolve(
    _source: unknown,
    { id, passwordCurrent, passwordNew }: ChangePasswordByUser_i
  ) {
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
