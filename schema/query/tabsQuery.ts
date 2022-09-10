import graphql = require("graphql");
const { GraphQLID, GraphQLList } = graphql;

const Tab = require("../../mongoModels/tabSchema");

import { TabType } from "../types/tabType";
import { User_i } from "../types/userType";

export const tabsQueryField = {
  type: new GraphQLList(TabType),
  args: { userId: { type: GraphQLID } },
  resolve(parent: User_i, { userId }: { userId: string }) {
    return Tab.find({ userId: userId });
  },
};
