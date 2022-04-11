
const graphql = require("graphql");
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');


const {
  GraphQLObjectType,
  GraphQLString,

} = graphql;


export const RssFetchFields = {
  // userId: { type: GraphQLID },
//   rssLink: { type: GraphQLString },
  rssFetchData: { type: GraphQLJSONObject},
};


export const RssFetchType = new GraphQLObjectType({
  name: "RssFetch",
  fields: () => ({
    ...RssFetchFields,
  }),
});