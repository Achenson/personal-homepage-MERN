import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
// import { UserType } from "../types/userType";
import { DeleteAccountByUserType } from "../types/deleteAccountByUserType";
import { GraphQLError } from "graphql";


import fs = require("fs");
import path = require("path");
import bcrypt = require("bcrypt");

const Settings = require("../../mongoModels/settingsSchema");
const User = require("../../mongoModels/userSchema");
const Tab = require("../../mongoModels/tabSchema");
const Bookmark = require("../../mongoModels/bookmarkSchema");

import { RequestWithAuth } from "../middleware/isAuth";

interface AuthData_i {
  id: string;
  password: string;
}

export const deleteAccountByUserMutationField = {
  type: DeleteAccountByUserType,
  args: {
    id: { type: GraphQLID },
    // password: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
  },
  async resolve(_source: unknown, { id, password }: AuthData_i, request: RequestWithAuth) {

    if (!request.isAuth) {
      return new GraphQLError("Auth error");
      // throw new Error("Auth error");
    }

    // @ts-ignore
    const user = await User.findById(id);
    if (!user) {
      // throw new Error("User does not exist!");
      console.log("NO USER");

      return {
        name: null,
        error: "User does not exist",
      };
    }

    console.log("USER EXISTS");

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      // throw new Error("Password is incorrect!");
      console.log("PASSWORD INCORRECT");

      return {
        name: null,
        error: "Password is incorrect",
      };
    }

    console.log("PASSWORD CORRECT");

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

    let deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser) {
      fs.rmdir(path.join("backgroundImgs/" + id + "/"), {recursive: true}, (err: any) => {
        if (err) console.error(err);
      });

      return {
        name: deletedUser.name,
        error: null,
      };
    }

    return {
      name: null,
      error: "Account deletion not successful",
    };
    // let deletedUser = await User.findByIdAndDelete(id, (err: Error) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   fs.rmdir(path.join("backgroundImgs/" + id + "/"), (err: any) => {
    //     if (err) console.error(err);
    //   });

    // });
  },
};
