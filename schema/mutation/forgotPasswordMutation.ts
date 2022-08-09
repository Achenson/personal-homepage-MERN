
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

const createForgotPasswordToken = require("../middleware/forgotPassToken.ts");
const User = require("../../mongoModels/userSchema");
const sendEmail = require("../utils/sendEmail.ts");

export const forgotPasswordMutationField = {
  type: GraphQLBoolean,
  args: {
    email: { type: GraphQLString },
  },

  //   resolve(_source: unknown, args: {stringToAdd: string}) {
  async resolve(_source: unknown, args: { email: string }) {
    //     let passforgotUri;

    // if (environment === "production") {
    //   passforgotUri = "https://wikispeedtyping.herokuapp.com/#/passforgot-change/"
    // } else {
    //   passforgotUri = "http://localhost:3000/passforgot-change/";
    // }

    let passforgotUri = "http://localhost:3000/passforgot-change/";

    const user = await User.findOne({ email: args.email });

    if (!user) {
      // to change ??
      return false;
    }

    const token = createForgotPasswordToken(user);

    await sendEmail(args.email, `${passforgotUri}${token}`);

    return true;
  },
};
