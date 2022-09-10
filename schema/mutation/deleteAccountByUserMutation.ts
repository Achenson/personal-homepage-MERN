import fs = require("fs");
import path = require("path");
import bcrypt = require("bcrypt");
import { GraphQLID, GraphQLString } from "graphql";
import { DeleteAccountByUserType } from "../types/deleteAccountByUserType";
import { GraphQLError } from "graphql";

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
    password: { type: GraphQLString },
  },
  async resolve(
    _source: unknown,
    { id, password }: AuthData_i,
    request: RequestWithAuth
  ) {
    if (!request.isAuth) {
      return new GraphQLError("Auth error");
    }

    // @ts-ignore
    const user = await User.findById(id);
    if (!user) {
      console.log("NO USER");
      return {
        name: null,
        error: "User does not exist",
      };
    }
    console.log("USER EXISTS");

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      console.log("PASSWORD INCORRECT");

      return {
        name: null,
        error: "Password is incorrect",
      };
    }

    console.log("PASSWORD CORRECT");
    // await so that everything connected to user is deleted before
    // user is deleted and returned
    await Promise.all([
      Settings.findOneAndDelete({ userId: id }),
      Bookmark.deleteMany({ userId: id }),
      Tab.deleteMany({ userId: id }),
    ]);

    let deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser) {
      fs.rmdir(
        path.join("backgroundImgs/" + id + "/"),
        { recursive: true },
        (err: any) => {
          if (err) console.error(err);
        }
      );

      return {
        name: deletedUser.name,
        error: null,
      };
    }

    return {
      name: null,
      error: "Account deletion not successful",
    };
  },
};
