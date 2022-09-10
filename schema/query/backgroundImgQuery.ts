import graphql = require("graphql");
import fs = require("fs");
import path = require("path");
const { GraphQLID } = graphql;

import { RequestWithAuth } from "../middleware/isAuth";
import { BackgroundImgType } from "../types/backgroundImgType";

import { User_i } from "../types/userType";

export const backgroundImgQueryField = {
  type: BackgroundImgType,
  args: { userId: { type: GraphQLID } },
  async resolve(
    parent: User_i,
    { userId }: { userId: string },
    request: RequestWithAuth
  ) {
    console.log("!!!backgroundImgQuery  started !!!!");

    if (!request.isAuth) return;

    let backgroundImgFiles = fs.readdirSync(
      path.join(__dirname, "..", "..", "backgroundImgs", userId)
    );

    if (backgroundImgFiles.length === 0) {
      return {
        backgroundImgUrl: null,
      };
    }

    let backgroundImgUrl =
      "background_img/" + userId + "/" + backgroundImgFiles[0];

    if (backgroundImgUrl) {
      return {
        backgroundImgUrl: backgroundImgUrl,
      };
    }
    return null;

    // let fetchedBackgroundImg = await fetchBackgroundImg();
    // return fetchedBackgroundImg;
    // async function fetchBackgroundImg() {
    //   let response = await fetch(
    //     "http://localhost:4000/background_img/" + userId
    //   );
    //   let fetchedImgResponse = await response.json();
    //   //   return response.json();
    //   return fetchedImgResponse;
    // }
  },
};
