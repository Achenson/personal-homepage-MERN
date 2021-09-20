const graphql = require("graphql");

const Settings = require("../../mongoModels/settings")

import { SettingsType, Settings_I } from "../types/settingsType";

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = graphql;

export interface User_I {
  id: string;
  name: string;
  email: string;
  password: string;
  settings: Settings_I
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
      resolve(parent: User_I) {
        return Settings.findOne({ userId: parent.id });
      },
    },
  }),
});
