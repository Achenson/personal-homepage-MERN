import graphql = require("graphql");

const Settings = require("../../mongoModels/settingsSchema");

import { SettingsType } from "../types/settingsType";

const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString } = graphql;

export interface User_basic_i {
  name: string;
  email: string;
  password: string;
}

export interface User_i extends User_basic_i {
  id: string;
  tokenVersion: number;
}

export interface UserToChangeByAdmin_i {
  id: string;
  name: string | null;
  email: string | null;
  password: string | null;
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
    tokenVersion: { type: GraphQLInt },
    settings: {
      type: SettingsType,
      resolve(parent: User_i) {
        return Settings.findOne({ userId: parent.id });
      },
    },
  }),
});

export const AddUserType = new GraphQLObjectType({
  name: "AddUser",
  fields: () => ({
    ...UserFields,
    error: { type: GraphQLString },
  }),
});
