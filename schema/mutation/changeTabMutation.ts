import { GraphQLError } from "graphql";

const Tab = require("../../mongoModels/tabSchema");
import { RequestWithAuth } from "../middleware/isAuth";

import { TabDatabase_i, TabFields, TabType } from "../types/tabType";

export const changeTabMutationField = {
  type: TabType,
  args: {
    ...TabFields,
  },
  resolve(_source: unknown, args: TabDatabase_i, request: RequestWithAuth) {
    if (!request.isAuth) {
      return new GraphQLError("Auth error");
    }

    let update = {
      title: args.title,
      color: args.color,
      column: args.column,
      priority: args.priority,
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
