import graphql = require("graphql");

// const User = require("../../mongoModels/userSchema");

// import { User_i from "../types/userType";

import { GlobalSettingsState } from "../../client/src/utils/interfaces";

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = graphql;

export interface SettingsDatabase_i extends GlobalSettingsState {
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
  backgroundColor: { type: GraphQLString },
  folderColor: { type: GraphQLString },
  noteColor: { type: GraphQLString },
  rssColor: { type: GraphQLString },
  uiColor: { type: GraphQLString },
  colColor_1: { type: GraphQLString },
  colColor_2: { type: GraphQLString },
  colColor_3: { type: GraphQLString },
  colColor_4: { type: GraphQLString },
  colColorImg_1: { type: GraphQLString },
  colColorImg_2: { type: GraphQLString },
  colColorImg_3: { type: GraphQLString },
  colColorImg_4: { type: GraphQLString },
};

export const SettingsType = new GraphQLObjectType({
  name: "Settings",
  fields: () => ({
    ...SettingsFields,
    // user: {
    //   resolve(parent: Settings_i) {
    //     return User.findById(parent.userId);
    //   },
    // },
  }),
});
