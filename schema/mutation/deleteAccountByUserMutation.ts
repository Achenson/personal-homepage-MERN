import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "../types/userType";

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

interface AuthData_i {
  id: string;
  password: string;
}

export const deleteAccountByUserMutationField = {
  type: UserType,
  args: {
    id: { type: GraphQLID },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_source: unknown, { id, password }: AuthData_i) {
    // @ts-ignore
    const user = await User.findOneById(id);
    if (!user) {
      // throw new Error("User does not exist!");
      return {
        error: "User does not exist!",
      };
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      // throw new Error("Password is incorrect!");
      return {
        error: "Password is incorrect!",
      };
    }

    //  return { userId: user.id, token: token, error: null };

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

    return User.findByIdAndDelete(id, (err: Error) => {
      if (err) {
        console.log(err);
        return;
      }

      fs.rmdir(path.join("backgroundImgs/" + id + "/"), (err: any) => {
        if (err) console.error(err);
      });
    });
  },
};
