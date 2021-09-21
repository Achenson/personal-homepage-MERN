const graphql = require("graphql");

import { RootQuery } from "./query/rootQuery";

import { Mutation } from "./mutation/mutation";


const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLBoolean,
} = graphql;

// const RootQuery = new GraphQLObjectType({
//   name: "RootQueryType",
//   fields: {
//     settings: {
//       type: SettingsType,
//       args: { userId: { type: GraphQLID } },
//       resolve(_source: unknown, { userId }: { userId: string }) {
//         return Settings.findOne({ userId: userId });
//       },
//     },
//   },
// });


export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
