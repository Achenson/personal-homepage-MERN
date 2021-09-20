const graphql = require("graphql");

const User = require("../../mongoModels/user");

import { User_I, UserType } from "../types/userType";

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = graphql;

export interface Settings_I {
  id: string;
  userId: string;
  picBackground: boolean;
  defaultImage: string;
  oneColorForAllCols: boolean;
  limitColGrowth: boolean;
  hideNonDeletable: boolean;
  disableDrag: boolean;
  numberOfCols: 1 | 2 | 3 | 4;
  user: User_I;
}

export const SettingsType = new GraphQLObjectType({
  name: "Settings",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    picBackground: { type: GraphQLBoolean },
    defaultImage: { type: GraphQLString },
    oneColorForAllCols: { type: GraphQLBoolean },
    limitColGrowth: { type: GraphQLBoolean },
    hideNonDeletable: { type: GraphQLBoolean },
    disableDrag: { type: GraphQLBoolean },
    numberOfCols: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent: Settings_I) {
        return User.findById(parent.userId);
      },
    },
  }),
});
