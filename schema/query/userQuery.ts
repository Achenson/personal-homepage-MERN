const graphql = require("graphql");
const User = require("../../mongoModels/userSchema")

const { GraphQLObjectType, GraphQLID } = graphql;

import { User_i, UserType } from "../types/userType";

export const userQueryField = {
  type: UserType,
  args: { userId: { type: GraphQLID } },
  resolve(parent: User_i, { userId }: { userId: string }) {
    return User.findOne({ userId: userId });
  },
};
