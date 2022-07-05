import { GraphQLString, GraphQLObjectType, GraphQLID } from "graphql";

export interface AuthDataForgotPassword_i {
  email: string
}

export interface AuthDataPasswordChangeAfterForgot_i {
  token: string
  newPassword: string
}

export interface AuthDataInput_i {
  email_or_name: string
  password: string
}

export interface AuthDataInputRegister_i {
  name: string
  email: string
  password: string
}

export interface AuthData_i {
  userId: string
  token: string
}

export const AuthDataField = {
  userId: { type: GraphQLID },
  token: { type: GraphQLString},
  error: {type: GraphQLString}
};

export const AuthDataType = new GraphQLObjectType({
  name: "Auth",
  fields: () => ({
    ...AuthDataField,
  }),
});
