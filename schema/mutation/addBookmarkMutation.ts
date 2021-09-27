const graphql = require("graphql");

const Bookmark = require("../../mongoModels/bookmarkSchema");

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
  resolve(_source: unknown, args: BookmarkDatabase_i) {
    let newBookmark = new Bookmark({
      userId: args.userId,
      title: args.title,
      URL: args.URL,
      tags: args.tags,
    });

    newBookmark.save((err: Error, bookmarkProduct: BookmarkDatabase_i) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(bookmarkProduct);
    });
  },
};
