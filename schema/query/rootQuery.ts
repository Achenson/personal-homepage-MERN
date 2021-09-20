const graphql = require("graphql");

const Settings = require("../../mongoModels/settings")

import { SettingsType } from "../types/settingsType";

const { GraphQLObjectType, GraphQLID } = graphql;

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    settings: {
      type: SettingsType,
      args: { userId: { type: GraphQLID } },
      resolve(_source: unknown, { userId }: { userId: string }) {
        return Settings.findOne({ userId: userId });
      },
    },
  },
});
