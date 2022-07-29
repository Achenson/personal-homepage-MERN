import graphql = require("graphql");

import { RootQuery } from "./query/rootQuery";
import { Mutation } from "./mutation/mutation";

const {
  GraphQLSchema,
} = graphql;

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
