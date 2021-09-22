const graphql = require("graphql");

const Settings = require("../../mongoModels/settingsSchema")

import { SettingsType, Settings_i } from "../types/settingsType";
import { Bookmark_i } from "./bookmarkType";
import { Tab_i } from "./tabType";

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
  settings: Settings_i;
  tabs: Tab_i[];
  bookmarks: Bookmark_i[];
}

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    // tokenVersion: { type: GraphQLInt },
    settings: {
      type: SettingsType,
      resolve(parent: User_i) {
        return Settings.findOne({ userId: parent.id });
      },
    },
  }),
});
