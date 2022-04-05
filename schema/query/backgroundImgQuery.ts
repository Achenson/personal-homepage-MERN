const graphql = require("graphql");
const fetch = require('node-fetch');

const { GraphQLObjectType, GraphQLID } = graphql;

import { BackgroundImgType } from "../types/backgroundImgType";
import { User_i } from "../types/userType";

export const backgroundImgQueryField = {
  type: BackgroundImgType,
  args: { userId: { type: GraphQLID } },
  async resolve(parent: User_i, { userId }: { userId: string }) {
    console.log("!!!backgroundImgQuery  started !!!!");

    let fetchedBackgroundImg = await fetchBackgroundImg();
    console.log("fetchedBackgroundImg");
    console.log(fetchedBackgroundImg);

    return fetchedBackgroundImg;

    async function fetchBackgroundImg() {
      console.log("fetching background img query");
      console.log("userId");
      console.log(userId);

      let response = await fetch(
        "http://localhost:4000/background_img/" + userId
      );

      console.log("response");
      console.log(response);
      

      if (!response.ok) {
          console.log("response not ok");
        throw new Error("Network response was not ok");
        
      }

      if(response.ok) {
        console.log("response ok");
      }



      let fetchedImgResponse = await response.json();

      //   return response.json();
      console.log("fetched img response");
      console.log(fetchedImgResponse);
      return fetchedImgResponse;
    }
  },
};
