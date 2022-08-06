const graphql = require("graphql");

import { changeSettingsMutationField } from "./changeSettingsMutation";
import { addUserMutationField } from "./addUserMutation";
import { deleteUsersByAdminMutationField } from "./deleteUsersByAdminMutation";
import { deleteBookmarkMutationField } from "./deleteBookmarkMutation";
import { deleteTabMutationField } from "./deleteTabMutation";
import { addTabMutationField } from "./addTabMutation";
import { addBookmarkMutationField } from "./addBookmarkMutation";
import { changeUserByAdminMutationField } from "./changeUserByAdminMutation";
import { changeTabMutationField } from "./changeTabMutation";
import { changeBookmarkMutationField } from "./changeBookmarkMutation";
import { loginMutationField } from "./loginMutation";
import { logoutMutationField } from "./logoutMutation";
import { backgroundImgUploadMutationField } from "./backgroundImgMutation";
import { revokeRefreshTokenMutationField } from "./revokeRefreshTokenMutation";
import { deleteAccountByUserMutationField } from "./deleteAccountByUserMutation";
import { changeUserByUserMutationField } from "./changeUserByUserMutation";
import { changePasswordByUserMutationField } from "./changePasswordByUserMutation";
import { forgotPasswordMutationField } from "./forgotPasswordMutation";
import { changePasswordAfterForgotMutationField } from "./changePasswordAfterForgotMutation";

const { GraphQLObjectType } = graphql;

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    changeBookmark: changeBookmarkMutationField,
    changeSettings: changeSettingsMutationField,
    changeTab: changeTabMutationField,
    changePasswordByUser: changePasswordByUserMutationField,
    changePasswordAfterForgot: changePasswordAfterForgotMutationField,
    changeUserByAdmin: changeUserByAdminMutationField,
    changeUserByUser: changeUserByUserMutationField,
    addBookmark: addBookmarkMutationField,
    addTab: addTabMutationField,
    addUser: addUserMutationField,
    deleteUsersByAdmin: deleteUsersByAdminMutationField,
    deleteBookmark: deleteBookmarkMutationField,
    deleteTab: deleteTabMutationField,
    login: loginMutationField,
    logout: logoutMutationField,
    backgroundImgUpload: backgroundImgUploadMutationField,
    revokeRefreshToken: revokeRefreshTokenMutationField,
    deleteAccountByUser: deleteAccountByUserMutationField,
    forgotPassword: forgotPasswordMutationField,
  },
});
