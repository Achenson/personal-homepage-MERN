import { GraphQLID } from "graphql";
import { UserType } from "../types/userType";

const fs = require("fs");
const path = require("path");

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

export const deleteUserByAdminMutationField = {
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

    let deletedUser = await User.findByIdAndDelete(args.id);

    if (deletedUser) {
      fs.rmdir(path.join("backgroundImgs/" + args.id + "/"), (err: any) => {
        if (err) console.error(err);
      });

      return deletedUser;
    }

    return {
      name: null,
      error: "Account deletion not successful",
    };

    // return User.findByIdAndDelete(args.id, (err: Error) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }

    //   fs.rmdir(path.join("backgroundImgs/" + args.id + "/"), (err: any) => {
    //     if (err) console.error(err);
    //   });

    // });
  },
};
