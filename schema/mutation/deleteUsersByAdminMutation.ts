import { GraphQLID, GraphQLList } from "graphql";
import { DeleteUsersByAdminType } from "../types/deleteUsersByAdminType";

import fs = require("fs");
import path = require("path");

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

interface DeletedUser {
  userId: string;
  wasDeleted: boolean;
}

export const deleteUsersByAdminMutationField = {
  type: DeleteUsersByAdminType,
  args: {
    // id: { type: GraphQLID },
    ids: { type: new GraphQLList(GraphQLID) },
  },
  // async resolve(_source: unknown, args: { id: string }) {
  async resolve(_source: unknown, args: { ids: [string] }) {
    // let deletedUsers = [];

    let deletedUsers = args.ids.map(async (id) => {
      // await so that everything connected to user is deleted before
      // user is deleted and returned

      // await Promise.all([
      //   Settings.findOneAndDelete({ userId: id }),
      //   Bookmark.deleteMany({ userId: id }),
      //   Tab.deleteMany({ userId: id }),
      // ]);

      /*  await Settings.findOneAndDelete({ userId: args.id });
    await Bookmark.deleteMany({ userId: args.id });
    await Tab.deleteMany({ userId: args.id }); */

      let deletedUser = await User.findByIdAndDelete(id);

      if (deletedUser) {
        await Promise.all([
          Settings.findOneAndDelete({ userId: id }),
          Bookmark.deleteMany({ userId: id }),
          Tab.deleteMany({ userId: id }),
        ]);

        fs.rmdir(path.join("backgroundImgs/" + id + "/"), {recursive: true}, (err: any) => {
          if (err) {
            console.error(err);
          }
        });

        // return { [deletedUser.id]: true };
        return {
          userId: deletedUser.id,
          wasDeleted: true,
        };
      }
      if (!deletedUser) {
        // return { [id]: false };
        return {
          userId: id,
          wasDeleted: false,
        };
      }

      // return {
      //   name: null,
      //   error: "Account deletion not successful",
      // };
    });

    let awaitedDeletedUsers = await Promise.all(deletedUsers);

    // console.log("deletedUsers");
    // console.log(deletedUsers);
    console.log("awaitedDeletedUsers");
    console.log(awaitedDeletedUsers);

    return { ids: awaitedDeletedUsers };

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
