import { GraphQLBoolean } from "graphql";

const sendRefreshToken = require("../middleware/sendRefreshToken");
import { RequestWithAuth } from "../middleware/isAuth";

export const logoutMutationField = {
  type: GraphQLBoolean,
  args: {},
  resolve(_source: unknown, args: unknown, { res }: RequestWithAuth) {
    sendRefreshToken(res, "");
    return true;
  },
};
