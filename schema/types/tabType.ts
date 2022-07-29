import graphql = require("graphql");

const Bookmark = require("../../mongoModels/bookmarkSchema");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} = graphql;

export interface TabLocal_i {
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

export interface TabDatabase_i extends TabLocal_i {
  id: string;
  userId: string;
}

export const TabFields = {
  id: { type: GraphQLID },
  userId: { type: GraphQLID },
  title: { type: GraphQLString },
  color: { type: GraphQLString },
  column: { type: GraphQLInt },
  priority: { type: GraphQLInt },
  opened: { type: GraphQLBoolean },
  openedByDefault: { type: GraphQLBoolean },
  deletable: { type: GraphQLBoolean },
  type: { type: GraphQLString },
  noteInput: { type: GraphQLString },
  rssLink: { type: GraphQLString },
  date: { type: GraphQLBoolean },
  description: { type: GraphQLBoolean },
  itemsPerPage: { type: GraphQLInt },
}

export const TabType = new GraphQLObjectType({
  name: "Tab",
  fields: () => ({
    ...TabFields
    /*    id: { type: GraphQLID },
    title: { type: GraphQLString },
    URL: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLID) }, */

    // bookmarkIds: { type: GraphQLList({type: GraphQLID})},
    // bookmarks: {
    //   type: GraphQLList({type: BookmarkType}),
    //   resolve(parent: Tab_i) {
    //     return Bookmark.find
    //   }
    // }
  }),
});
