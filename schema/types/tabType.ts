const graphql = require("graphql");

import { Bookmark_i, BookmarkType } from "../types/bookmarkType";

const Bookmark = require("../../mongoModels/bookmarkSchema");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNull
} = graphql;

export interface Tab_i {
  id: number | string;
  userId: number | string;
  title: string;
  color: string | null;
  column: number;
  priority: number;
  opened: boolean;
  openedByDefault: boolean;
  deletable: boolean;
  type: "folder" | "note" | "rss";
  noteInput?: string | null;
  rssLink?: string | null;
  date?: boolean | null;
  description?: boolean | null;
  itemsPerPage?: number | null;

  // not being used actually?
  // items?: [object] | never[] | [];
  // backend only
  // bookmarkIds?: string[];
  // bookmarks?: Bookmark_i[]; 
}

export const TabType = new GraphQLObjectType({
  name: "Tab",
  fields: () => ({
 /*    id: { type: GraphQLID },
    title: { type: GraphQLString },
    URL: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLID) }, */
    id: { type: GraphQLID },
    userId: {type: GraphQLID},
    title: { type: GraphQLString },
    color: { type: GraphQLString | GraphQLNull },
    column: { type: GraphQLInt },
    priority: { type: GraphQLInt },
    opened: { type: GraphQLBoolean },
    openedByDefault: { type: GraphQLBoolean },
    deletable: { type: GraphQLBoolean },
    type: {type: GraphQLString},
    noteInput: { type: GraphQLString | GraphQLNull },
    rssLink: { type: GraphQLString | GraphQLNull },
    date: { type: GraphQLBoolean | GraphQLNull },
    description: { type: GraphQLBoolean | GraphQLNull },
    itemsPerPage: { type: GraphQLInt | GraphQLNull },
    // bookmarkIds: { type: GraphQLList({type: GraphQLID})},
    // bookmarks: {
    //   type: GraphQLList({type: BookmarkType}),
    //   resolve(parent: Tab_i) {
    //     return Bookmark.find
    //   }
    // }
  }),
});
