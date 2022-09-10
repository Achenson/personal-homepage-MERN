var express = require("express");
var router = express.Router();
import fs = require("fs");

import { Response } from "express";

import { RequestWithAuth } from "../schema/middleware/isAuth";

router.get("/:userId", (req: RequestWithAuth, res: Response) => {
  // console.log("GETTING BACKGROUND IMG");

  let backgroundImgFiles = fs.readdirSync(
    "backgroundImgs/" + req.params.userId
  );
  let backgroundImgUrl =
    "background_img/" + req.params.userId + "/" + backgroundImgFiles[0];

  if (!backgroundImgUrl) {
    res.status(500).json({
      error: "No background image available",
    });
    return;
  }
  res.status(201).json({
    backgroundImgUrl: backgroundImgUrl,
  });
});
module.exports = router;
