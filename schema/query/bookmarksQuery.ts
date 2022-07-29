import graphql = require("graphql");
const Bookmark = require("../../mongoModels/bookmarkSchema");

const { GraphQLObjectType, GraphQLID, GraphQLList } = graphql;

import { BookmarkType } from "../types/bookmarkType";
import { User_i } from "../types/userType";

export const bookmarksQueryField = {
  type: new GraphQLList(BookmarkType),
  args: { userId: { type: GraphQLID } },
  resolve(parent: User_i, { userId }: { userId: string }) {
    return Bookmark.find({ userId: userId });
  },
};
