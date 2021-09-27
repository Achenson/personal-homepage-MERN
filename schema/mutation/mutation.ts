const graphql = require("graphql");

import { changeSettingsMutationField } from "./changeSettingsMutation";
import { addUserMutationField } from "./addUserMutation";
import { deleteUserMutationField } from "./deleteUserMutation";
import { deleteBookmarkMutationField } from "./deleteBookmarkMutation";
import { deleteTabMutationField } from "./deleteTabMutation";

const { GraphQLObjectType } = graphql;

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    changeSettings: changeSettingsMutationField,
    addUser: addUserMutationField,
    deleteUser: deleteUserMutationField,
    deleteBookmark: deleteBookmarkMutationField,
    deleteTab: deleteTabMutationField
  },
});
