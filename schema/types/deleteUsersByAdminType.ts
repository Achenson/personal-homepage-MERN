import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
} from "graphql";

// export interface ChangeUserByUser_i {
//   id: string
//   name: string | null
//   email: string | null
//   passwordCurrent: string
// }

const IsIdDeleted = new GraphQLObjectType({
  name: "IsIdDeleted",
  fields: () => ({
    userId: { type: GraphQLID },
    wasDeleted: { type: GraphQLBoolean },
  }),
});

export const DeleteUsersByAdminField = {
  // currentPassword: { type: GraphQLString },

  //   name: { type: GraphQLString },
  //   email: { type: GraphQLString },
  //   error: { type: GraphQLString },

  ids: { type: new GraphQLList(IsIdDeleted) },
};

export const DeleteUsersByAdminType = new GraphQLObjectType({
  name: "DeleteUsersByAdmin",
  fields: () => ({
    ...DeleteUsersByAdminField,
  }),
});
