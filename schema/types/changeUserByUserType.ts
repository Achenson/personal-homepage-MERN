import { GraphQLString, GraphQLObjectType, GraphQLID } from "graphql";

export const ChangeUserByUserField = {
    // currentPassword: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    error: {type: GraphQLString}
  };
  
  export const ChangeUserByUserType = new GraphQLObjectType({
    name: "ChangeUserByUser",
    fields: () => ({
      ...ChangeUserByUserField,
    }),
  });
  