const graphql = require("graphql");

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

import { resolve } from "path/posix";
import { bookmarks } from "../data/defaultBookmarks";
import { tabs } from "../data/defaultTabs";
import { Bookmark_i } from "../types/bookmarkType";
import { Tab_i } from "../types/tabType";

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

    return user.save(async (err: Error, settingsProduct: User_i) => {
      if (err) console.log(err);

      console.log("product");
      console.log(settingsProduct);

      let newSettings = new Settings({
        userId: settingsProduct.id,
        picBackground: false,
        defaultImage: "img",
        oneColorForAllCols: false,
        limitColGrowth: false,
        hideNonDeletable: false,
        disableDrag: false,
        numberOfCols: 4,
      });

      newSettings.save();

      let arrOfPromises: Promise<unknown>[] = [];

      for (let el of tabs) {
        let newPromise = new Promise((resolve, reject) => {
          let newTab = new Tab({
            ...el,
            userId: settingsProduct.id,
          });

          newTab.save((err: Error, folderProduct: Tab_i) => {
            if (err) {
              console.log(err);
              reject();
            }
            console.log(folderProduct.id);
            resolve(folderProduct.id);
          });
        });

        arrOfPromises.push(newPromise);
      }

      let arrOfFolderIds = await Promise.all(arrOfPromises);

      /*     let arrOfFolderIds: (string|number)[] = await Promise.all([
        new Promise((resolve, reject) => {
          let newTab = new Tab({
            ...tabs[0],
            userId: settingsProduct.id,
          });

          newTab.save((err: Error, folderProduct: Tab_i) => {
            if (err) {
              console.log(err);
              reject();
            }
            console.log(folderProduct.id);
            resolve(folderProduct.id);
          });
        }),

        new Promise((resolve, reject) => {
          let newTab = new Tab({
            ...tabs[1],
            userId: settingsProduct.id,
          });

          newTab.save((err: Error, folderProduct: Tab_i) => {
            if (err) {
              console.log(err);
              reject();
            }
            console.log(folderProduct.id);
            resolve(folderProduct.id);
          });
        }),
      ]); */

      console.log(arrOfFolderIds);

      bookmarks.forEach((el, i) => {
        let newBookmark = new Bookmark({
          ...el,
          userId: settingsProduct.id,
          tags: [...arrOfFolderIds],
        });

        newBookmark.save((err: Error, bookmarkProduct: Bookmark_i) => {
          if (err) console.log(err);
        });
      });
    });
  },
};
