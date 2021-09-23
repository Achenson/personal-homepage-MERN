import { Tab_i } from "./tabType";

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
  id: number | string;
  userId: number | string;
  title: string;
  URL: string;
  folderIds: string[];
  // folders: Tab_i[];
}

export const BookmarkType = new GraphQLObjectType({
  name: "Bookmark",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    title: { type: GraphQLString },
    URL: { type: GraphQLString },
    folderIds: { type: new GraphQLList(GraphQLString) },
  }),
});


