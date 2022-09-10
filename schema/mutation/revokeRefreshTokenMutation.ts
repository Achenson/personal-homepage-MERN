import graphql = require("graphql");
const { GraphQLID } = graphql;

const User = require("../../mongoModels/userSchema");

import { UserType } from "../types/userType";

export const revokeRefreshTokenMutationField = {
  type: UserType,
  args: {
    userId: { type: GraphQLID },
  },
  resolve(_source: unknown, args: { userId: string }) {
    return User.findByIdAndUpdate(
      { _id: args.userId },
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );
  },
};
