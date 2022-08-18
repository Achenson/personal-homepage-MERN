import { GraphQLID } from "graphql";
import { BookmarkType } from "../types/bookmarkType";
import { GraphQLError } from "graphql";

import { RequestWithAuth } from "../middleware/isAuth";

const Bookmark = require("../../mongoModels/bookmarkSchema");

export const deleteBookmarkMutationField = {
  type: BookmarkType,
  args: {
    id: { type: GraphQLID },
  },
  resolve(_source: unknown, args: { id: string }, request: RequestWithAuth) {
    if (!request.isAuth) {
      return new GraphQLError("Auth error");
      // throw new Error("Auth error");
    }

    return Bookmark.findByIdAndDelete(args.id);
  },
};
