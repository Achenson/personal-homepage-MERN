const graphql = require("graphql");

import { changeSettingsMutationField } from "./changeSettingsMutation";
import { addUserMutationField } from "./addUserMutation";

const { GraphQLObjectType } = graphql;

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    changeSettings: changeSettingsMutationField,
    addUser: addUserMutationField,
  },
});
