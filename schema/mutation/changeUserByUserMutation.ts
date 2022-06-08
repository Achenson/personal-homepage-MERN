const User = require("../../mongoModels/userSchema");
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

// import { UserFields, UserType, User_i } from "../types/userType";
import { ChangeUserByUserType } from "../types/changeUserByUserType";

const bcrypt = require("bcrypt");

interface ChangeUserData_i {
  id: string;
  name: string;
  email: string;
  currentPassword: string;
}

export const changeUserByUserMutationField = {
  type: ChangeUserByUserType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    // password: { type: new GraphQLNonNull(GraphQLString) },
    currentPassword: { type: GraphQLString },
  },
  async resolve(
    _source: unknown,
    { id, name, email, currentPassword }: ChangeUserData_i
  ) {
    const user = await User.findById(id);
    if (!user) {
      console.log("NO USER");

      return {
        name: null,
        email: null,
        error: "User does not exist",
      };
    }

    const isEqual = await bcrypt.compare(currentPassword, user.password);
    if (!isEqual) {
      console.log("PASSWORD INCORRECT");

      return {
        name: null,
        email: null,
        error: "Password is incorrect",
      };
    }

    let update = {
      name: name,
      email: email,
    };

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
