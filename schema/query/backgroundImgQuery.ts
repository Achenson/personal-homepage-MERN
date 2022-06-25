const graphql = require("graphql");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

import { testUserId } from "../../client/src/state/data/testUserId";

const { GraphQLObjectType, GraphQLID } = graphql;

import { BackgroundImgType } from "../types/backgroundImgType";
import { User_i } from "../types/userType";

export const backgroundImgQueryField = {
  type: BackgroundImgType,
  args: { userId: { type: GraphQLID } },
  async resolve(parent: User_i, { userId }: { userId: string }, request: any) {
    console.log("!!!backgroundImgQuery  started !!!!");

    let userIdOrTestId = request.isAuth ? request.userId : testUserId;

    let backgroundImgFiles = fs.readdirSync(
      path.join(__dirname, "..", "..", "backgroundImgs", userIdOrTestId)
    );

    console.log("backgroundImgFiles");
    console.log(backgroundImgFiles);

    if (backgroundImgFiles.length === 0) {
      return {
        backgroundImgUrl: null,
      };
    }

    let backgroundImgUrl =
      "background_img/" + userIdOrTestId + "/" + backgroundImgFiles[0];

    console.log("backgroundImgUrl");
    console.log(backgroundImgUrl);

    if (backgroundImgUrl) {
      return {
        backgroundImgUrl: backgroundImgUrl,
      };

      // backgroundImgUrl;
    }
    return null;

    // return null;

    // let fetchedBackgroundImg = await fetchBackgroundImg();
    // console.log("fetchedBackgroundImg");
    // console.log(fetchedBackgroundImg);

    // return fetchedBackgroundImg;

    // async function fetchBackgroundImg() {
    //   console.log("fetching background img query");
    //   console.log("userId");
    //   console.log(userId);

    //   let response = await fetch(
    //     "http://localhost:4000/background_img/" + userId
    //   );

    //   // console.log("response");
    //   // console.log(response);

    //   if (!response.ok) {
    //     console.log("response not ok");
    //     throw new Error("Network response was not ok");
    //   }

    //   if (response.ok) {
    //     console.log("response ok");
    //   }

    //   let fetchedImgResponse = await response.json();

    //   //   return response.json();
    //   console.log("fetched img response");
    //   console.log(fetchedImgResponse);
    //   return fetchedImgResponse;
    // }
  },
};
