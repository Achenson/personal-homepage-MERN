
const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
} = graphql;


export const RssFetchFields = {
  // userId: { type: GraphQLID },
//   rssLink: { type: GraphQLString },
  rssFetchUrl: { type: GraphQLString },
};


export const RssFetchType = new GraphQLObjectType({
  name: "RssFetch",
  fields: () => ({
    ...RssFetchFields,
  }),
});