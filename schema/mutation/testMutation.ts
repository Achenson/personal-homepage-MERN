const graphql = require("graphql");

// const Bookmark = require("../../mongoModels/bookmarkSchema");

/* import {
  BookmarkFields,
  BookmarkType,
  BookmarkDatabase_i,
} from "../types/bookmarkType"; */

import { TestMutationField, TestMutationType } from "../types/testMutationType";

export const testMutationField = {
  type: TestMutationType,
  args: {
    ...TestMutationField,
  },
  //   resolve(_source: unknown, args: {stringToAdd: string}) {
  resolve(rootValue: any) {
    // see commented out middleware in server.js before /graphql endpoint
    console.log(rootValue.request.customKey);
  },
};
