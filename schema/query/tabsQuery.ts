import graphql = require("graphql");
const Tab= require("../../mongoModels/tabSchema");

const { GraphQLObjectType, GraphQLID, GraphQLList } = graphql;

import { TabType } from "../types/tabType";
import { User_i } from "../types/userType";

export const tabsQueryField = {
  type: new GraphQLList(TabType),
  args: { userId: { type: GraphQLID } },
  resolve(parent: User_i, { userId }: { userId: string }) {
    return Tab.find({ userId: userId });
  },
};
