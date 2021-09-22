const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} = graphql;

export interface Bookmark_i {
  id: string;
  title: string;
  URL: string;
  folderIds: string[];
}

export const BookmarkType = new GraphQLObjectType({
  name: "Bookmark",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    URL: { type: GraphQLString },
    folderIds: { type: new GraphQLList(GraphQLID) },
  }),
});
