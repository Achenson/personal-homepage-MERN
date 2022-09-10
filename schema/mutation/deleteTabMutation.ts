import { GraphQLID, GraphQLError } from "graphql";

const Tab = require("../../mongoModels/tabSchema");
import { RequestWithAuth } from "../middleware/isAuth";

import { TabType } from "../types/tabType";

export const deleteTabMutationField = {
  type: TabType,
  args: {
    id: { type: GraphQLID },
  },
  resolve(_source: unknown, args: { id: string }, request: RequestWithAuth) {
    if (!request.isAuth) {
      return new GraphQLError("Auth error");
    }

    return Tab.findByIdAndDelete(args.id);
  },
};
