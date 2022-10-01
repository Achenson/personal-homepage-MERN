import graphql = require("graphql");
import fs = require("fs");
import fsExtra = require("fs-extra");
import path = require("path");
import download = require("image-downloader");
const { GraphQLID } = graphql;

const BackgroundImgUrl = require("../../mongoModels/backgroundImgUrlSchema");

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

/* logic before implementing imgbb
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
*/

    let backgroundDir = path.join(
      __dirname,
      "..",
      "..",
      "backgroundImgs",
      userId
    );

    fsExtra.ensureDirSync(backgroundDir);

    let backgroundImgFiles = fs.readdirSync(backgroundDir);

    if (backgroundImgFiles.length === 0) {
      let backgroundImgUrlRes = await BackgroundImgUrl.findOne({
        userId: userId,
      });

      if (backgroundImgUrlRes?.URL) {
        const downloadOptions = {
          url: backgroundImgUrlRes.URL,
          dest: backgroundDir,
        };

        download
          .image(downloadOptions)
          .then(({ filename }) => {
            return {
              backgroundImgUrl: filename,
            };
          })
          .catch((err) => console.error(err));
      }

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
