import { GraphQLBoolean } from "graphql";
const sendRefreshToken = require("../middleware/sendRefreshToken");

interface ExpressReqRes {
    req: Request;
    res: Response;
  }

export const logoutMutationField = {
    type: GraphQLBoolean,
    args: {},
    resolve( _source: unknown, args: unknown, { req, res }: ExpressReqRes) {
      sendRefreshToken(res, "");
      return true;
    },
}

