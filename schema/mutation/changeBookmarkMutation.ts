const Bookmark = require("../../mongoModels/bookmarkSchema");

import {
  BookmarkFields,
  BookmarkDatabase_i,
  BookmarkType,
} from "../types/bookmarkType";

export const changeBookmarkMutationField = {
  type: BookmarkType,
  args: {
    ...BookmarkFields,
  },
  resolve(_source: unknown, args: BookmarkDatabase_i) {
    let update = {
      id: args.id,
      userId: args.userId,
      title: args.title,
      URL: args.URL,
      tags: args.tags,
      defaultFaviconFallback: args.defaultFaviconFallback
    };

    return Bookmark.findByIdAndUpdate(args.id, update, {
      // to return updated object
      new: true,
      upsert: false,
      useFindAndModify: false,
    });
  },
};
