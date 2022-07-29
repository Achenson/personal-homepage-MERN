import graphql = require("graphql");

const Settings = require("../../mongoModels/settingsSchema");

import { SettingsType } from "../types/settingsType";
/* import { Bookmark_i } from "./bookmarkType";
import { Tab_i } from "./tabType"; */

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = graphql;

export interface User_i {
  id: string;
  name: string;
  email: string;
  password: string;
  tokenVersion: number;
  /*   settings: Settings_i;
  tabs: Tab_i[];
  bookmarks: Bookmark_i[]; */
}

export interface UserToChangeByAdmin_i {
  id: string;
  name: string | null;
  email: string | null;
  password: string | null;
  tokenVersion: number | null;
}


export const UserFields = {
  id: { type: GraphQLID },
  name: { type: GraphQLString },
  email: { type: GraphQLString },
  password: { type: GraphQLString },
};

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    ...UserFields,
    // tokenVersion: { type: GraphQLInt },
    settings: {
      type: SettingsType,
      resolve(parent: User_i) {
        return Settings.findOne({ userId: parent.id });
      },
    },
  }),
});
