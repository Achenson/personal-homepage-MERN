import express = require("express");
import Parser = require("rss-parser");

const router = express.Router();
const rssParser = new Parser();

import {Response } from "express";

import { RequestWithAuth } from "../schema/middleware/isAuth";

// @ts-ignore
router.get("/:rsslink", async (req: RequestWithAuth, res: Response) => {
 
  let response = await rssParser.parseURL(req.params.rsslink);
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
