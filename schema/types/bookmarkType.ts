import graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} = graphql;

interface Bookmark_i {
  title: string;
  URL: string;
  defaultFaviconFallback: boolean;
}

export interface BookmarkLocal_i extends Bookmark_i {
  tagIndices: number[];
}

export interface BookmarkDatabase_i extends Bookmark_i {
  id: string;
  userId: string;
  tags: string[];
}

export const BookmarkFields = {
  id: { type: GraphQLID },
  userId: { type: GraphQLID },
  title: { type: GraphQLString },
  URL: { type: GraphQLString },
  tags: { type: new GraphQLList(GraphQLID) },
  defaultFaviconFallback: {type: GraphQLBoolean}
};

export const BookmarkType = new GraphQLObjectType({
  name: "Bookmark",
  fields: () => ({
    ...BookmarkFields,
  }),
});
