const graphql = require("graphql");

const Settings = require("../../mongoModels/settings")

import { SettingsType } from "../types/settingsType";
import { User_I } from "../types/userType";

const { GraphQLObjectType, GraphQLID } = graphql;

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    settings: {
      type: SettingsType,
      args: { userId: { type: GraphQLID } },
      resolve(parent: User_I, { userId }: { userId: string }) {
        return Settings.findOne({ userId: userId });
      },
    },
  },
});
