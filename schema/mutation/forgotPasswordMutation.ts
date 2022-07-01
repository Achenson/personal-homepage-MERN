const graphql = require("graphql");
import { GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

const createForgotPasswordToken = require("../middleware/forgotPassToken.js");
const User = require("../../mongoModels/userSchema");


export const forgotPasswordMutationField = {
  type: GraphQLBoolean,
  args: {
    email: {type: GraphQLString}
  },

  //   resolve(_source: unknown, args: {stringToAdd: string}) {
  async resolve(_source: unknown, args: {email: string}) {


//     let passforgotUri;

// if (environment === "production") {
//   passforgotUri = "https://wikispeedtyping.herokuapp.com/#/passforgot-change/"
// } else {
//   passforgotUri = "http://localhost:3000/passforgot-change/";
// }

    let passforgotUri = "http://localhost:3000/passforgot-change/"

    const user = await User.findOne({ email: args.email });

    if (!user) {
        // to change ??
        return true;
      }

      const token = createForgotPasswordToken(user);

    //   await sendEmail(
    //     args.email,
    //     `${passforgotUri}${token}`
    //   );

      return true;



  },
};
