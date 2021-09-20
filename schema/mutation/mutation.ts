const graphql = require("graphql");

const SettingsModel = require("../../mongoModels/settings");
const UserModel = require("../../mongoModels/user");

import { SettingsType, Settings_I } from "../types/settingsType";
import { UserType, User_I } from "../types/userType";

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
    changeSettings: {
      type: SettingsType,
      args: {
        // userId: { type: new GraphQLNonNull(GraphQLString) }, ?
        userId: { type: GraphQLID },
        picBackground: { type: GraphQLBoolean },
        defaultImage: { type: GraphQLString },
        oneColorForAllCols: { type: GraphQLBoolean },
        limitColGrowth: { type: GraphQLBoolean },
        hideNonDeletable: { type: GraphQLBoolean },
        disableDrag: { type: GraphQLBoolean },
        numberOfCols: { type: GraphQLInt },
      },
      resolve(_source: unknown, args: Settings_I) {
        let update = {
          picBackground: args.picBackground,
          defaultImage: args.defaultImage,
          oneColorForAllCols: args.oneColorForAllCols,
          limitColGrowth: args.limitColGrowth,
          hideNonDeletable: args.hideNonDeletable,
          disableDrag: args.disableDrag,
          numberOfCols: args.numberOfCols,
        };

        return SettingsModel.findOneAndUpdate({ userId: args.userId }, update, {
          // to return updated object
          new: true,
          upsert: true, // Make this update into an upsert,
          useFindAndModify: false,
        });
      },
    },
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },

      resolve(_source: unknown, args: User_I) {
        let user = new UserModel({
          name: args.name,
          email: args.email,
          password: args.password,
        });

        return user.save((err: Error, product: User_I) => {
          if (err) console.log(err);

          console.log("product");
          console.log(product);

          let settings = new SettingsModel({
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

        // return UserModel.findOneAndUpdate({ userId: args.userId }, update, {
        //   // to return updated object
        //   new: true,
        //   upsert: true, // Make this update into an upsert,
        //   useFindAndModify: false,
        // });
      },
    },
  },
});
