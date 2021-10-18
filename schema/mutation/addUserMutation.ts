const graphql = require("graphql");

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

import {
  columnColors,
  imageColumnColors,
} from "../../client/src/utils/data/colors_column";
import { backgroundColors } from "../../client/src/utils/data/colors_background";
import { tabColors } from "../../client/src/utils/data/colors_tab";

import { bookmarks } from "../data/defaultBookmarks";
import { tabs } from "../data/defaultTabs";

import { BookmarkDatabase_i, BookmarkLocal_i } from "../types/bookmarkType";
import { TabDatabase_i } from "../types/tabType";
import { UserFields, UserType, User_i } from "../types/userType";

export const addUserMutationField = {
  type: UserType,
  args: {
    ...UserFields,
  },
  resolve(_source: unknown, args: User_i) {
    let user = new User({
      name: args.name,
      email: args.email,
      password: args.password,
    });

    return new Promise((resolve, reject) => {
      user.save(async (err: Error, userProduct: User_i) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        console.log("product");
        console.log(userProduct);

        let newSettings = new Settings({
          userId: userProduct.id,
          picBackground: false,
          defaultImage: "defaultBackground",
          oneColorForAllCols: false,
          limitColGrowth: false,
          hideNonDeletable: false,
          disableDrag: false,
          numberOfCols: 4,
          date: true,
          description: false,
          itemsPerPage: 7,
          backgroundColor: backgroundColors[0][1],
          folderColor: tabColors[7][2],
          noteColor: tabColors[1][2],
          rssColor: tabColors[9][2],
          uiColor: tabColors[7][2],
          colColor_1: columnColors[0][8],
          colColor_2: columnColors[1][5],
          colColor_3: columnColors[1][8],
          colColor_4: columnColors[3][2],
          colColorImg_1: imageColumnColors[2][6],
          colColorImg_2: imageColumnColors[2][6],
          colColorImg_3: imageColumnColors[3][5],
          colColorImg_4: imageColumnColors[0][5],
        });

        newSettings.save();

        let arrOfPromises: Promise<string>[] = [];

        for (let el of tabs) {
          let newPromise = new Promise<string>((resolve, reject) => {
            let newTab = new Tab({
              ...el,
              userId: userProduct.id,
            });

            newTab.save((err: Error, folderProduct: TabDatabase_i) => {
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

        let arrOfFolderIds: string[] = await Promise.all(arrOfPromises);

        console.log(arrOfFolderIds);

        function calcTagNames(bookmark: BookmarkLocal_i) {
          let newArr: string[] = [];

          // for each el of arrOfFolderIds
          arrOfFolderIds.forEach((el, i) => {
            // if i is present in bookmark.tagIndices
            if (bookmark.tagIndices.indexOf(i) > -1) {
              // add arrOfFolderIds[i] to newArr
              newArr.push(el);
            }
          });

          return newArr;
        }

        bookmarks.forEach((el: BookmarkLocal_i) => {
          let newBookmark = new Bookmark({
            ...el,
            userId: userProduct.id,
            tags: calcTagNames(el),
          });

          newBookmark.save(
            (err: Error, bookmarkProduct: BookmarkDatabase_i) => {
              if (err) console.log(err);
            }
          );
        });

        resolve(userProduct);
      });
    });
  },
};
