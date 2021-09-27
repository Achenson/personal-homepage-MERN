const graphql = require("graphql");

const Tab = require("../../mongoModels/tabSchema");

import { TabDatabase_i, TabType } from "../types/tabType";
const { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLInt } =
  graphql;

export const addTabMutationField = {
  type: TabType,
  args: {
    userId: { type: GraphQLID },
    title: { type: GraphQLString },
    color: { type: GraphQLString },
    column: { type: GraphQLInt },
    priority: { type: GraphQLInt },
    opened: { type: GraphQLBoolean },
    openedByDefault: { type: GraphQLBoolean },
    deletable: { type: GraphQLBoolean },
    type: { type: GraphQLString },
    noteInput: { type: GraphQLString },
    rssLink: { type: GraphQLString },
    date: { type: GraphQLBoolean },
    description: { type: GraphQLBoolean },
    itemsPerPage: { type: GraphQLInt },
  },
  resolve(_source: unknown, args: TabDatabase_i) {
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

    newTab.save((err: Error, tabProduct: TabDatabase_i) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(tabProduct);
    });
  },
};
