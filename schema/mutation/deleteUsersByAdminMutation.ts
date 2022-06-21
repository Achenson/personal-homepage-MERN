import { GraphQLID, GraphQLList } from "graphql";
import { UserType } from "../types/userType";

const fs = require("fs");
const path = require("path");

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

export const deleteUsersByAdminMutationField = {
  type: UserType,
  args: {
    // id: { type: GraphQLID },
    ids: { type: new GraphQLList(GraphQLID) },
  },
  // async resolve(_source: unknown, args: { id: string }) {
  resolve(_source: unknown, args: { ids: [string] }) {
    // let deletedUsers = [];

    let deletedUsers = args.ids.map(async (id) => {
      // await so that everything connected to user is deleted before
      // user is deleted and returned
      await Promise.all([
        Settings.findOneAndDelete({ userId: id }),
        Bookmark.deleteMany({ userId: id }),
        Tab.deleteMany({ userId: id }),
      ]);
      /*  await Settings.findOneAndDelete({ userId: args.id });
    await Bookmark.deleteMany({ userId: args.id });
    await Tab.deleteMany({ userId: args.id }); */

      let deletedUser = await User.findByIdAndDelete(id);

      if (deletedUser) {
        fs.rmdir(path.join("backgroundImgs/" + id + "/"), (err: any) => {
          if (err) console.error(err);
        });

        // return deletedUser;
        return { [deletedUser.id]: true };
        // deletedUsers.push({ [deletedUser.id]: true });
      }
      if (!deletedUser) {
        return { id: false };
        // deletedUsers.push({ id: false });
      }

      // return {
      //   name: null,
      //   error: "Account deletion not successful",
      // };
    });

    return deletedUsers;

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
