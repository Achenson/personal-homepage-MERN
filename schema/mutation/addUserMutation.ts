const graphql = require("graphql");

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = graphql;

import { bookmarksData } from "../../client/src/state/data/bookmarksData";
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

      const tabs = [
        {
          localId: "ALL_TAGS",
          title: "all bookmarks",
          color: "red-400",
          column: 1,
          priority: 1,
          opened: true,
          openedByDefault: true,
          deletable: false,
          type: "folder",
        },

        {
          localId: "2",
          title: "guardian",
          color: null,
          column: 3,
          priority: 0,
          opened: false,
          openedByDefault: false,
          deletable: true,
          type: "rss",
          date: null,
          description: null,
          itemsPerPage: null,
          // items: [],
          rssLink: "https://feeds.theguardian.com/theguardian/uk-news/rss",
        },
      ];

      const bookmarks = [
        {
          title: "facebook",
          URL: "https://www.facebook.com/",
          tags: ["1"],
        },
        {
          title: "gmail",
          URL: "https://mail.google.com/mail/u/0/",
          // not saved to db
          tags: ["1"],
        },
      ];

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
