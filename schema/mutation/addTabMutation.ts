const Tab = require("../../mongoModels/tabSchema");

import { TabDatabase_i, TabFields, TabType } from "../types/tabType";

import { GraphQLError } from "graphql";
import { RequestWithAuth } from "../middleware/isAuth";

export const addTabMutationField = {
  type: TabType,
  args: {
    ...TabFields,
  },
  resolve(_source: unknown, args: TabDatabase_i, request: RequestWithAuth) {
    if (!request.isAuth) {
      return new GraphQLError("Auth error");
      // throw new Error("Auth error");
    }

    let newTab = new Tab({
      userId: args.userId,
      title: args.title,
      color: args.color,
      column: args.column,
      priority: args.priority,
      opened: args.opened,
      openedByDefault: args.openedByDefault,
      deletable: args.deletable,
      type: args.type,
      noteInput: args.noteInput,
      rssLink: args.rssLink,
      date: args.date,
      description: args.description,
      itemsPerPage: args.itemsPerPage,
    });

    return new Promise((resolve, reject) => {
      newTab.save((err: Error, tabProduct: TabDatabase_i) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(tabProduct);
        }
      });
    });

    /*    newTab.save((err: Error, tabProduct: TabDatabase_i) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(tabProduct);
    }); */
  },
};
