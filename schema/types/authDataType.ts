import { GraphQLString, GraphQLObjectType, GraphQLID } from "graphql";

export interface AuthDataInput_i {
  email_or_name: string
  password: string
}

export interface AuthData_i {
  userId: string
  token: string
}

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
