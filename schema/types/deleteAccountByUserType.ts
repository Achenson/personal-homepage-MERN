import { GraphQLString, GraphQLObjectType, GraphQLID } from "graphql";

export const DeleteAccountByUserField = {
    name: { type: GraphQLString },
    error: {type: GraphQLString}
  };
  
  export const DeleteAccountByUserType = new GraphQLObjectType({
    name: "DeleteAccount",
    fields: () => ({
      ...DeleteAccountByUserField,
    }),
  });
  