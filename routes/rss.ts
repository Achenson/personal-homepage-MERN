var express = require("express");
var router = express.Router();
import Parser = require("rss-parser");
let rssParser = new Parser();

import { RequestWithAuth } from "../schema/middleware/isAuth";

import { Request, Response, NextFunction } from "express";
router.get("/:rsslink", async (req: RequestWithAuth, res: Response) => {
  console.log("fetching rss server rest");
  console.log("fetching rss server rest");
  console.log("fetching rss server rest");
  console.log("fetching rss server rest");
  console.log("fetching rss server rest");

  console.log(req.isAuth);

  let response = await rssParser.parseURL(req.params.rsslink);
  // console.log(response);
  if (!response) {
    res.status(500).send({
      error: "No RSS data available",
    });
    return;
  }

  res.status(201).send({
    rssFetchData: response,
  });
});
module.exports = router;
