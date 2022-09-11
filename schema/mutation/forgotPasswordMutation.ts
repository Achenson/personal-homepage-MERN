import { GraphQLBoolean, GraphQLString } from "graphql";

const User = require("../../mongoModels/userSchema");
const createForgotPasswordToken = require("../middleware/forgotPassToken.ts");
const sendEmail = require("../utils/sendEmail.ts");

export const forgotPasswordMutationField = {
  type: GraphQLBoolean,
  args: {
    email: { type: GraphQLString },
  },

  async resolve(_source: unknown, args: { email: string }) {
    const environment = process.env.NODE_ENV;

    let passforgotUri;
    if (environment === "production") {
      passforgotUri = "https://smoothtabs.herokuapp.com/#/passforgot-change/";
    } else {
      passforgotUri = "http://localhost:3000/passforgot-change/";
    }

    const user = await User.findOne({ email: args.email });

    if (!user) {
      return false;
    }

    const token = createForgotPasswordToken(user);
    await sendEmail(args.email, `${passforgotUri}${token}`);
    return true;
  },
};
