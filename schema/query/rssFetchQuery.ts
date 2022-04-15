const graphql = require("graphql");
const fetch = require("node-fetch");

import { NextFunction, Request, Response } from "express";

interface ExpressReqRes {
  req: Request;
  res: Response;
}


const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;

import { RssFetchType } from "../types/rssFetchType";
import { User_i } from "../types/userType";

export const rssFetchQueryField = {
  type: RssFetchType,
  args: { rssLink: { type: GraphQLString } },
  async resolve(parent: User_i, { rssLink }: { rssLink: string }, request: any) {
  // async resolve(parent: User_i, { rssLink }: { rssLink: string }) {
    console.log("fetching RSS serverside starded graphql");
    // @ts-ignore
  //  console.log(req.isAuth);

  // console.log("reqest")
  // console.log(request)
  console.log("request.isAuth")
  console.log(request.isAuth)
   
  console.log("res")
  // console.log(res)
   
    

    let fetchedRss = await fetchRssUrl();
    // console.log("fetchedRss");
    // console.log(fetchedRss);

    return fetchedRss;

    async function fetchRssUrl() {
      let baseFetchUrl = "http://localhost:4000/fetch_rss/";
      let extendedRSSurl = `${rssLink}?format=xml`;

      try {
        // let response = await parser.parseURL(currentTab?.rssLink);
        // return response;
        let toSendUrl = encodeURIComponent(`${rssLink}`);

        let response = await fetch(baseFetchUrl + toSendUrl);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let fetchedRssResponse = await response.json();

        // console.log("fetched rss/*  */ response");
        // console.log(fetchedRssResponse);
        return fetchedRssResponse;
      } catch (err) {
        // let newResponse = await parser.parseURL(extendedRSSurl);
        // return newResponse;
        let newToSendUrl = encodeURIComponent(extendedRSSurl);

        let newResponse = await fetch(baseFetchUrl + newToSendUrl);

        if (!newResponse.ok) {
          throw new Error("Network response was not ok");
        }

        return newResponse.json();
      }
    }
  },
};
