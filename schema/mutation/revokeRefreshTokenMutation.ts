/* 
import { UserFields, User_i } from "../types/userType";
const graphql = require("graphql");

const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} = graphql;

export const revokeRefreshTokensForUserMutationField = {
  type: UserType,
  args: {
    //   userId: { type: new GraphQLNonNull(GraphQLID) },
    ...UserFields,
  },
  resolve(_source: unknown, args, { req, res }) {

    return User.findOneAndUpdate(
      { _id: args.userId },
      { $inc: { tokenVersion: 1 } },
      { new: true },
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log("response");
          console.log(response);
        }
      }
    );
  },
};
 */

import graphql = require("graphql");

const {
  GraphQLID,
  GraphQLNonNull,
} = graphql;

const User = require("../../mongoModels/userSchema");

import { UserType, User_i } from "../types/userType";

export const revokeRefreshTokenMutationField = {
  type: UserType,
  args: {
    // ...UserFields,
    // userId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: GraphQLID },
  },
  resolve(_source: unknown, args: { userId: string }) {
    return User.findByIdAndUpdate(
      { _id: args.userId },
      { $inc: { tokenVersion: 1 } },
      { new: true },
      (err: Error, response: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log("revokeToken response");
          console.log(response);
        }
      }
    );
  },
};
