const graphql = require("graphql");

import {settingsQueryField} from "./settingsQuery"

const { GraphQLObjectType, GraphQLID } = graphql;

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    settings: settingsQueryField
  },
});

