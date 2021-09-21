const graphql = require("graphql");
const Settings = require("../../mongoModels/settings");

const { GraphQLObjectType, GraphQLID } = graphql;

import { SettingsType } from "../types/settingsType";
import { User_I } from "../types/userType";

export const settingsQueryField = {
  type: SettingsType,
  args: { userId: { type: GraphQLID } },
  resolve(parent: User_I, { userId }: { userId: string }) {
    return Settings.findOne({ userId: userId });
  },
};
