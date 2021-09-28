const graphql = require("graphql");

import { changeSettingsMutationField } from "./changeSettingsMutation";
import { addUserMutationField } from "./addUserMutation";
import { deleteUserMutationField } from "./deleteUserMutation";
import { deleteBookmarkMutationField } from "./deleteBookmarkMutation";
import { deleteTabMutationField } from "./deleteTabMutation";
import { addTabMutationField } from "./addTabMutation";
import { addBookmarkMutationField } from "./addBookmarkMutation";
import { changeUserMutationField } from "./changeUserMutation";
import { changeTabMutationField } from "./changeTabMutation";

const { GraphQLObjectType } = graphql;

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    changeSettings: changeSettingsMutationField,
    changeTab: changeTabMutationField,
    changeUser: changeUserMutationField,
    addBookmark: addBookmarkMutationField,
    addTab: addTabMutationField,
    addUser: addUserMutationField,
    deleteUser: deleteUserMutationField,
    deleteBookmark: deleteBookmarkMutationField,
    deleteTab: deleteTabMutationField
  },
});
