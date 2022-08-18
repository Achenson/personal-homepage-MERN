const Tab = require("../../mongoModels/tabSchema");
import { TabDatabase_i, TabFields, TabType } from "../types/tabType";

import { GraphQLError } from "graphql";
// import { testUserId } from "../../client/src/state/data/testUserId";

import { RequestWithAuth } from "../middleware/isAuth";

export const changeTabMutationField = {
  type: TabType,
  args: {
    ...TabFields,
  },
  resolve(_source: unknown, args: TabDatabase_i, request: RequestWithAuth) {

    // console.log("change tab mutation is Auth");
    // console.log(request.isAuth);
    // console.log(request.userId);
    
    
    if (!request.isAuth) {
      return new GraphQLError("Auth error");
      // throw new Error("Auth error");
    }

    let update = {
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
    };

    return Tab.findByIdAndUpdate(args.id, update, {
      // to return updated object
      new: true,
      upsert: false,
      useFindAndModify: false,
    });
  },
};
