import cors = require("cors");
import express = require("express");
import dotenv = require("dotenv");
import { graphqlHTTP } from "express-graphql";
// const { graphqlHTTP } = require("express-graphql");
// import { graphqlUploadExpress } = require("graphql-upload");
import helmet = require("helmet");
const mongoose = require("mongoose");
import Parser = require("rss-parser");
import fs = require("fs");
import path = require("path");
import cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const rssRoute = require('./routes/rss')
const refreshTokenRoute = require ('./routes/refreshToken')
var backgroundImg = require('./routes/backgroundImg')


import User = require("./mongoModels/userSchema");
import {
  backgroundImgUpload,
  newBackgroundImageName,
} from "./schema/utils/multer";
const createAccessToken = require("./schema/middleware/accessToken");
const createRefreshToken = require("./schema/middleware/refreshToken");
const sendRefreshToken = require("./schema/middleware/sendRefreshToken");
const isAuth = require("./schema/middleware/isAuth");

// const BackgroundImgSchema = require("../../mongoModels/BackgroundImgSchema");
const BackgroundImgSchema = require("./mongoModels/backgroundImgSchema");

import { schema } from "./schema/schema";

// import { testUserId } from "./client/src/state/data/testUserId";
import { BackgroundImg } from "./schema/types/backgroundImgType";
let rssParser = new Parser();
// let upload = multer({dest: "uploads/"})

const app = express();
const port = 4000;

import { NextFunction, Response } from "express";
import { RequestWithAuth } from "./schema/middleware/isAuth";


// ============
// app.use(helmet());

app.use(
  helmet({
    // to enable express-graphql playground
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

// credentials: Configures the Access-Control-Allow-Credentials CORS header.
//  Set to true to pass the header, otherwise it is omitted.
// The Access-Control-Allow-Origin response header indicates whether
//  the response can be shared with requesting code from the given origin.
// origin: https://developer.mozilla.org/en-US/docs/Glossary/Origin

/* app.use(
  cors({
    origin: "*"
  })
); */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      // more specific routes: not needed! http://localhost:4000" is an origin and everything after is allowed
    ],

    credentials: true,
  })
);

app.use(isAuth);

//  parsing cookie only in the context of that particular route
// app.use("/refresh_token", cookieParser(), refreshTokenRoute);
app.use("/refresh_token", cookieParser());

app.use("/refresh_token", refreshTokenRoute)

app.use("/fetch_rss", rssRoute);

app.use("/background_img", express.static("backgroundImgs"));

// app.use('/background_img/:userId', backgroundImg);

// @ts-ignore
app.get("/background_img/:userId", (req: RequestWithAuth, res: Response) => {
  console.log("getting background img");

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

/*  app.use((req: Request, res: Response, next: any) => {
 req.customKey = "finally";
// console.log(req.customKey);
next()
}) */

app.use(
  "/graphql",
  // @ts-ignore
  (req: RequestWithAuth, res: Response, next: NextFunction) => {
    console.log("req.body /graphql");
    console.log(req.body);

    backgroundImgUpload(req, res, function (multerErr) {
      console.log("background img auth");
      console.log(req.isAuth);

      if (!req.body) {
        next();
        return;
      }

      if (multerErr) {
        console.log("multerErr");
        console.log(multerErr);
      }

      console.log("req.body background img upload");
      console.log(req.body);
      console.log("req.body operations");
      console.log(req.body.operations);

      // @ts-ignore
      if (!req.isAuth || !req.userId) return;

      let userId = req.userId;

      let newBackgroundImg = {
        userId: userId,
        backgroundImg: newBackgroundImageName,
      };

      BackgroundImgSchema.replaceOne(
        { userId: userId },
        newBackgroundImg,
        { upsert: true },
        (err: Error, backgroundImgProduct: BackgroundImg) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              error: err,
            });

            removeBackgroundImg(newBackgroundImageName, userId);
            return;
          }
          let dest = "backgroundImgs/" + userId + "/";

          fs.readdirSync(dest).forEach((file: string) => {
            // console.log(file);

            if (file !== newBackgroundImageName) {
              // removeBackgroundImg(file, req.params.userId);
              // removeBackgroundImg(file, userIdOrTestId);
              removeBackgroundImg(file, userId);
            }
          });

          res.status(201).json({
            message: "Created product successfully",
            createdProduct: backgroundImgProduct,
          });
        }
      );
    });
  }
);

app.use(
  "/graphql",
  // graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP((req, res) => {
    // console.log(req.headers);
    console.log("req.body express server");

    // @ts-ignore
    console.log(req.body);
    // @ts-ignore
    console.log(req.body?.variables?.file);

    return {
      schema: schema,
      graphiql: true,
      // rootValue: { request: req, response: res },
    };
  })
);

// function removeBackgroundImg(fileName: string, userIdOrDemoId: string) {
function removeBackgroundImg(fileName: string, userId: string) {
  fs.unlink(
    path.join("backgroundImgs/" + userId + "/", fileName),
    // path.join("backgroundImgs/" + userIdOrDemoId + "/", fileName),
    (err: any) => {
      if (err) console.error(err);
    }
  );
}

dotenv.config();

const MONGODB_CONNECTION_STRING = process.env.DB;

mongoose
  .connect(MONGODB_CONNECTION_STRING as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  // .catch((err: Mon) => console.log(err));
  .catch(() => console.log("err"));

// @ts-ignore
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!4");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
