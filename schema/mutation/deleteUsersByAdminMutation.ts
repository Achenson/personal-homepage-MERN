import fs = require("fs");
import path = require("path");
import { GraphQLID, GraphQLList } from "graphql";

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const BackgroundImgUrl = require("../../mongoModels/backgroundImgUrlSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");


import { DeleteUsersByAdminType } from "../types/deleteUsersByAdminType";

export const deleteUsersByAdminMutationField = {
  type: DeleteUsersByAdminType,
  args: {
    ids: { type: new GraphQLList(GraphQLID) },
  },
  async resolve(_source: unknown, args: { ids: [string] }) {
    let deletedUsers = args.ids.map(async (id) => {
      let deletedUser = await User.findByIdAndDelete(id);

      if (deletedUser) {
        await Promise.all([
          Settings.findOneAndDelete({ userId: id }),
          Bookmark.deleteMany({ userId: id }),
          Tab.deleteMany({ userId: id }),
          BackgroundImgUrl.findOneAndDelete({ userId: id })
        ]);

        fs.rmdir(
          path.join("backgroundImgs/" + id + "/"),
          { recursive: true },
          (err: any) => {
            if (err) {
              console.error(err);
            }
          }
        );

        return {
          userId: deletedUser.id,
          wasDeleted: true,
        };
      }
      if (!deletedUser) {
        return {
          userId: id,
          wasDeleted: false,
        };
      }
    });

    let awaitedDeletedUsers = await Promise.all(deletedUsers);

    return { ids: awaitedDeletedUsers };
  },
};
