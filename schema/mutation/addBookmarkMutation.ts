// const Bookmark = require("../../mongoModels/bookmarkSchema");
import Bookmark = require("../../mongoModels/bookmarkSchema");

import { GraphQLError } from "graphql";
import { RequestWithAuth } from "../middleware/isAuth";

import {
  BookmarkFields,
  BookmarkType,
  BookmarkDatabase_i,
} from "../types/bookmarkType";

export const addBookmarkMutationField = {
  type: BookmarkType,
  args: {
    ...BookmarkFields,
  },
  resolve(
    _source: unknown,
    args: BookmarkDatabase_i,
    request: RequestWithAuth
  ) {
    if (!request.isAuth) {
      return new GraphQLError("Auth error");
      // throw new Error("Auth error");
    }

    // @ts-ignore
    let newBookmark = new Bookmark({
      userId: args.userId,
      title: args.title,
      URL: args.URL,
      tags: args.tags,
      defaultFaviconFallback: false,
    });

    return new Promise((resolve, reject) => {
      newBookmark.save((err: Error, bookmarkProduct: BookmarkDatabase_i) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(bookmarkProduct);
        resolve(bookmarkProduct);
      });
    });
  },
};
