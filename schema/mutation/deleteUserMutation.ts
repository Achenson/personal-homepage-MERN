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
    // await so that everything connected to user is deleted before
    // user is deleted and returned
    await Promise.all([
      Settings.findOneAndDelete({ userId: args.id }),
      Bookmark.deleteMany({ userId: args.id }),
      Tab.deleteMany({ userId: args.id }),
    ]);
    /*  await Settings.findOneAndDelete({ userId: args.id });
    await Bookmark.deleteMany({ userId: args.id });
    await Tab.deleteMany({ userId: args.id }); */
    return User.findByIdAndDelete(args.id);
  },
};
