import graphql = require("graphql");
const Settings = require("../../mongoModels/settingsSchema");

const { GraphQLObjectType, GraphQLID } = graphql;

import { SettingsType } from "../types/settingsType";
import { User_i } from "../types/userType";

export const settingsQueryField = {
  type: SettingsType,
  args: { userId: { type: GraphQLID } },
  resolve(parent: User_i, { userId }: { userId: string }) {
    return Settings.findOne({ userId: userId });
  },
};
