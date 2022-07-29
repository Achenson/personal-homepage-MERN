import bcrypt = require("bcrypt");
const User = require("../../mongoModels/userSchema");

import { UserFields, UserType, UserToChangeByAdmin_i } from "../types/userType";

export const changeUserByAdminMutationField = {
  type: UserType,
  args: {
    ...UserFields,
  },
  async resolve(_source: unknown, args: UserToChangeByAdmin_i) {
    let update = {};

    let updateName = { name: args.name };
    let updateEmail = { email: args.email };
    // let updateToken = {tokenVersion: args.tokenVersion}

    if (args.name) {
      Object.assign(update, updateName);
    }

    if (args.email) {
      Object.assign(update, updateEmail);
    }

    if (args.password) {
      let newPassword = await bcrypt.hash(args.password, 12);
      let updatePassword = { password: newPassword };
      Object.assign(update, updatePassword);
    }

    // if (args.email) {
    //   Object.assign(update, updateToken);
    // }

    // let update = {
    //   name: args.name,
    //   email: args.email,
    //   password: args.password,
    // };

    return User.findByIdAndUpdate(args.id, update, {
      // to return updated object
      new: true,
      upsert: false, // Make this update into an upsert,
      useFindAndModify: false,
    });
  },
};
