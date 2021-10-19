import { GraphQLID } from "graphql";
import { TabType} from "../types/tabType";

const Tab = require("../../mongoModels/tabSchema");

export const deleteTabMutationField = {
  type: TabType,
  args: {
    id: { type: GraphQLID },
  },
  resolve(_source: unknown, args: { id: string }) {
    return Tab.findByIdAndDelete(args.id);
  },
};
