import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
} from "graphql";

const IsIdDeleted = new GraphQLObjectType({
  name: "IsIdDeleted",
  fields: () => ({
    userId: { type: GraphQLID },
    wasDeleted: { type: GraphQLBoolean },
  }),
});

export const DeleteUsersByAdminField = {
  ids: { type: new GraphQLList(IsIdDeleted) },
};

export const DeleteUsersByAdminType = new GraphQLObjectType({
  name: "DeleteUsersByAdmin",
  fields: () => ({
    ...DeleteUsersByAdminField,
  }),
});
