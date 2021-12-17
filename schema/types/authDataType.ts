import { GraphQLString, GraphQLObjectType, GraphQLID } from "graphql";

export const AuthDataField = {
  userId: { type: GraphQLID },
  token: { type: GraphQLString },
};

export const AuthDataType = new GraphQLObjectType({
  name: "Auth",
  fields: () => ({
    ...AuthDataField,
  }),
});
