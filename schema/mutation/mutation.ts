const graphql = require("graphql");

const Settings = require("../../mongoModels/settings");
const User = require("../../mongoModels/user");

import { UserType, User_i } from "../types/userType";

import {changeSettingsMutationField} from "./changeSettingsMutation"

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLBoolean,
} = graphql;

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    changeSettings: changeSettingsMutationField,
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },

      resolve(_source: unknown, args: User_i) {
        let user = new User({
          name: args.name,
          email: args.email,
          password: args.password,
        });

        return user.save((err: Error, product: User_i) => {
          if (err) console.log(err);

          console.log("product");
          console.log(product);

          let settings = new Settings({
            userId: product.id,
            picBackground: false,
            defaultImage: "img",
            oneColorForAllCols: false,
            limitColGrowth: false,
            hideNonDeletable: false,
            disableDrag: false,
            numberOfCols: 4,
          });

          settings.save();
        });
      },
    },
  },
});
