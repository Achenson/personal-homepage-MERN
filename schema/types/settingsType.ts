const graphql = require("graphql");

const User = require("../../mongoModels/userSchema");

import { User_i, UserType } from "../types/userType";

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = graphql;

export interface Settings_i {
  id: string;
  userId: string;
  picBackground: boolean;
  defaultImage: string;
  oneColorForAllCols: boolean;
  limitColGrowth: boolean;
  hideNonDeletable: boolean;
  disableDrag: boolean;
  numberOfCols: 1 | 2 | 3 | 4;
  // user: User_i;
}

export const SettingsFields = {
  id: { type: GraphQLID },
  userId: { type: GraphQLID },
  picBackground: { type: GraphQLBoolean },
  defaultImage: { type: GraphQLString },
  oneColorForAllCols: { type: GraphQLBoolean },
  limitColGrowth: { type: GraphQLBoolean },
  hideNonDeletable: { type: GraphQLBoolean },
  disableDrag: { type: GraphQLBoolean },
  numberOfCols: { type: GraphQLInt },
}

export const SettingsType = new GraphQLObjectType({
  name: "Settings",
  fields: () => ({
   ...SettingsFields
    // user: {
    //   type: UserType,
    //   resolve(parent: Settings_i) {
    //     return User.findById(parent.userId);
    //   },
    // },
  }),
});
