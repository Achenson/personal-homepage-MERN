import { GraphQLString, GraphQLObjectType } from "graphql";

/* const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} = graphql; */


export const TestMutationField = {

/*     
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    title: { type: GraphQLString },
    URL: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLID) }, */

    stringToAdd: {type: GraphQLString}

  };


  export const TestMutationType = new GraphQLObjectType({
    name: "testMutation",
    fields: () => ({
      ...TestMutationField,
    }),
  });
  