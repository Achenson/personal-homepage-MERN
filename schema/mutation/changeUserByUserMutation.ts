import bcrypt = require("bcrypt");
import { GraphQLID, GraphQLString, GraphQLError } from "graphql";

const User = require("../../mongoModels/userSchema");
import { RequestWithAuth } from "../middleware/isAuth";

import {
  ChangeUserByUserType,
  ChangeUserByUser_i,
} from "../types/changeUserByUserType";

export const changeUserByUserMutationField = {
  type: ChangeUserByUserType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    passwordCurrent: { type: GraphQLString },
  },
  async resolve(
    _source: unknown,
    { id, name, email, passwordCurrent }: ChangeUserByUser_i,
    request: RequestWithAuth
  ) {
    if (!request.isAuth) {
      return new GraphQLError("Auth error");
    }

    const user = await User.findById(id);
    if (!user) {
      console.log("NO USER");

      return {
        name: null,
        email: null,
        error: "User does not exist",
      };
    }

    const isEqual = await bcrypt.compare(passwordCurrent, user.password);
    if (!isEqual) {
      console.log("PASSWORD INCORRECT");

      return {
        name: null,
        email: null,
        error: "Password is incorrect",
      };
    }

    if (!name && !email) {
      return {
        name: null,
        email: null,
        error: "No new data to update",
      };
    }

    let arrOfBooleans = await Promise.all([
      new Promise((resolve, reject) => {
        // no name provided means it is the same as it was initially
        if (!name) {
          resolve(true);
        }

        User.findOne({ name: name }, (err: Error, res: any) => {
          if (err) {
            console.log(err);
            reject(err);
          }

          if (res != null) {
            console.log("name is already present in DB");
            resolve(false);
          } else {
            resolve(true);
          }
        });
      }),

      new Promise((resolve, reject) => {
        // no email provided means it is the same as it was initially
        if (!email) {
          resolve(true);
        }

        User.findOne({ email: email }, (err: Error, res: any) => {
          if (err) {
            console.log(err);
            reject(err);
          }

          if (res != null) {
            console.log("email is already present in DB");
            resolve(false);
          } else {
            resolve(true);
          }
        });
      }),
    ]);

    if (!arrOfBooleans[0]) {
      return {
        name: null,
        email: null,
        error: "Username already in use",
      };
    }

    if (!arrOfBooleans[1]) {
      return {
        name: null,
        email: null,
        error: "Email already in use",
      };
    }

    let update = {};
    let updateName = { name: name };
    let updateEmail = { email: email };

    if (name) {
      Object.assign(update, updateName);
    }

    if (email) {
      Object.assign(update, updateEmail);
    }

    let changedUser = await User.findByIdAndUpdate(id, update, {
      // to return updated object
      new: true,
      upsert: false, // Make this update into an upsert,
      useFindAndModify: false,
    });

    return {
      name: changedUser.name,
      email: changedUser.email,
      error: null,
    };
  },
};
