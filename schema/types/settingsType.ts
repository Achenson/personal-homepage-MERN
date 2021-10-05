const graphql = require("graphql");

// const User = require("../../mongoModels/userSchema");

// import { User_i, UserType } from "../types/userType";

import { GlobalSettingsState } from "../../client/src/utils/interfaces";

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = graphql;

export interface Settings_i extends GlobalSettingsState {
  id: string;
  userId: string;
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
  // rss
  date: { type: GraphQLBoolean },
  description: { type: GraphQLBoolean },
  itemsPerPage: { type: GraphQLInt },
};

export const SettingsType = new GraphQLObjectType({
  name: "Settings",
  fields: () => ({
    ...SettingsFields,
    // user: {
    //   type: UserType,
    //   resolve(parent: Settings_i) {
    //     return User.findById(parent.userId);
    //   },
    // },
  }),
});
