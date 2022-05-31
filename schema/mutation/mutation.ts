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
import { changeBookmarkMutationField } from "./changeBookmarkMutation";
import { testMutationField } from "./testMutation";
import {loginMutationField} from "./loginMutation"
import { logoutMutationField } from "./logoutMutation";
import { backgroundImgMutationField } from "./backgroundImgMutation";
import { revokeRefreshTokenMutationField } from "./revokeRefreshTokenMutation";


const { GraphQLObjectType } = graphql;

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    changeBookmark: changeBookmarkMutationField,
    changeSettings: changeSettingsMutationField,
    changeTab: changeTabMutationField,
    changeUser: changeUserMutationField,
    addBookmark: addBookmarkMutationField,
    addTab: addTabMutationField,
    addUser: addUserMutationField,
    deleteUser: deleteUserMutationField,
    deleteBookmark: deleteBookmarkMutationField,
    deleteTab: deleteTabMutationField,
    testMutation: testMutationField,
    loginMutation: loginMutationField,
    logoutMutation: logoutMutationField,
    backgroundImgMutation: backgroundImgMutationField,
    revokeRefreshToken: revokeRefreshTokenMutationField
  },
});
