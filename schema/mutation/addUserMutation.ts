const graphql = require("graphql");

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

import { bookmarks } from "../data/defaultBookmarks";
import { tabs } from "../data/defaultTabs";

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = graphql;

import { UserType, User_i } from "../types/userType";

export const addUserMutationField = {
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

      tabs.forEach((el, i) => {
        let newTab = new Tab({
          ...el,
          userId: product.id,
        });

        newTab.save();
      });

      bookmarks.forEach((el, i) => {
        let newBookmark = new Bookmark({
          ...el,
          userId: product.id,
        });
        newBookmark.save();
      });
    });
  },
};
