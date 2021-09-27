import { GraphQLID } from "graphql";
import { UserType } from "../types/userType";

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

export const deleteUserMutationField = {
  type: UserType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(_source: unknown, args: { id: string }) {
    await Settings.findOneAndDelete({ userId: args.id });
    await Bookmark.deleteMany({ userId: args.id });
    await Tab.deleteMany({ userId: args.id });
    return await User.findByIdAndDelete(args.id);
  },
};
