const graphql = require("graphql");

import { changeSettingsMutationField } from "./changeSettingsMutation";
import { addUserMutationField } from "./addUserMutation";
import { deleteUserByAdminMutationField } from "./deleteUserByAdminMutation";
import { deleteBookmarkMutationField } from "./deleteBookmarkMutation";
import { deleteTabMutationField } from "./deleteTabMutation";
import { addTabMutationField } from "./addTabMutation";
import { addBookmarkMutationField } from "./addBookmarkMutation";
import { changeUserByAdminMutationField } from "./changeUserByAdminMutation";
import { changeTabMutationField } from "./changeTabMutation";
import { changeBookmarkMutationField } from "./changeBookmarkMutation";
import { testMutationField } from "./testMutation";
import {loginMutationField} from "./loginMutation"
import { logoutMutationField } from "./logoutMutation";
import { backgroundImgMutationField } from "./backgroundImgMutation";
import { revokeRefreshTokenMutationField } from "./revokeRefreshTokenMutation";
import { deleteAccountByUserMutationField } from "./deleteAccountByUserMutation";
import { changeUserByUserMutationField } from "./changeUserByUserMutation";
import { changePasswordByUserMutationField } from "./changePasswordByUserMutation";


const { GraphQLObjectType } = graphql;

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    changeBookmark: changeBookmarkMutationField,
    changeSettings: changeSettingsMutationField,
    changeTab: changeTabMutationField,
    changePasswordByUser: changePasswordByUserMutationField,
    changeUserByAdmin: changeUserByAdminMutationField,
    changeUserByUser: changeUserByUserMutationField,
    addBookmark: addBookmarkMutationField,
    addTab: addTabMutationField,
    addUser: addUserMutationField,
    deleteUserByAdmin: deleteUserByAdminMutationField,
    deleteBookmark: deleteBookmarkMutationField,
    deleteTab: deleteTabMutationField,
    testMutation: testMutationField,
    loginMutation: loginMutationField,
    logoutMutation: logoutMutationField,
    backgroundImgMutation: backgroundImgMutationField,
    revokeRefreshToken: revokeRefreshTokenMutationField,
    deleteAccountByUser: deleteAccountByUserMutationField
  },
});
