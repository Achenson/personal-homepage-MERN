import { GraphQLID } from "graphql";
import { TabType} from "../types/tabType";

import { GraphQLError } from "graphql";

import { RequestWithAuth } from "../middleware/isAuth";


const Tab = require("../../mongoModels/tabSchema");

export const deleteTabMutationField = {
  type: TabType,
  args: {
    id: { type: GraphQLID },
  },
  resolve(_source: unknown, args: { id: string }, request: RequestWithAuth) {

    if (!request.isAuth) {
      return new GraphQLError("Auth error");
      // throw new Error("Auth error");
    }


    return Tab.findByIdAndDelete(args.id);
  },
};
