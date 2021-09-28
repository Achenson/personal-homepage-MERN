const User = require("../../mongoModels/userSchema");

import { UserFields, UserType, User_i } from "../types/userType";

export const changeUserMutationField = {
  type: UserType,
  args: {
    ...UserFields,
  },
  resolve(_source: unknown, args: User_i) {
    let update = {
      name: args.name,
      email: args.email,
      password: args.password,
    };
    return User.findByIdAndUpdate(args.id, update, {
      // to return updated object
      new: true,
      upsert: false, // Make this update into an upsert,
      useFindAndModify: false,
    });
  },
};
