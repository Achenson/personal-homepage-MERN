import { GraphQLID } from "graphql";
import { BookmarkType } from "../types/bookmarkType";

const Bookmark = require("../../mongoModels/bookmarkSchema");

export const deleteBookmarkMutationField = {
  type: BookmarkType,
  args: {
    id: { type: GraphQLID },
  },
  resolve(_source: unknown, args: { id: string }) {
    return Bookmark.findByIdAndDelete(args.id);
  },
};
