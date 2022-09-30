import cors = require("cors");
import express = require("express");
import { NextFunction, Response } from "express";
import dotenv = require("dotenv");
import { graphqlHTTP } from "express-graphql";
import helmet = require("helmet");
const mongoose = require("mongoose");
import fs = require("fs");
import path = require("path");
import cookieParser = require("cookie-parser");
// no ts typesx
const imgbbUploader = require("imgbb-uploader");

import BackgroundImgUrl = require("./mongoModels/backgroundImgUrlSchema");

const rssRoute = require("./routes/rss");
const refreshTokenRoute = require("./routes/refreshToken");
const backgroundImgRoute = require("./routes/backgroundImg");

import {
  backgroundImgUpload,
  newBackgroundImageName,
} from "./schema/utils/multer";
import { RequestWithAuth } from "./schema/middleware/isAuth";
const isAuth = require("./schema/middleware/isAuth");
import { schema } from "./schema/schema";

import { BackgroundImgUrl_i } from "./schema/types/backgroundImgType";

const app = express();
// 1 step Heroku
const port = process.env.PORT || 4000;

// change to this for development to enable graphql playground
// app.use(
//   helmet({
//     // to enable express-graphql playground
//     contentSecurityPolicy:
//       process.env.NODE_ENV === "production" ? undefined : false,
//   })
// );

// in production:
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
    },
  })
);

// credentials: Configures the Access-Control-Allow-Credentials CORS header.
//  Set to true to pass the header, otherwise it is omitted.
// The Access-Control-Allow-Origin response header indicates whether
//  the response can be shared with requesting code from the given origin.
// origin: https://developer.mozilla.org/en-US/docs/Glossary/Origin

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

// 2(3) step heroku
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(isAuth);
//  parsing cookie only in the context of that particular route
// app.use("/refresh_token", cookieParser(), refreshTokenRoute);
app.use("/refresh_token", cookieParser());
app.use("/refresh_token", refreshTokenRoute);

app.use("/fetch_rss", rssRoute);

app.use("/background_img", express.static("backgroundImgs"));
app.use("/background_img", backgroundImgRoute);

app.use(
  "/graphql",
  // @ts-ignore
  (req: RequestWithAuth, res: Response, next: NextFunction) => {
    // console.log("req.body /graphql");
    // console.log(req.body);
    // @ts-ignore
    backgroundImgUpload(req, res, function (multerErr) {
      // console.log("background img auth");
      // console.log(req.isAuth);
      // @ts-ignore
      if (!req.body) {
        next();
        return;
      }

      if (multerErr) {
        console.log("multerErr");
        console.log(multerErr);
        res.status(415).json({
          message: multerErr,
          createdProduct: null,
        });
        return;
      }
      // console.log("req.body background img upload");
      // console.log(req.body);
      // console.log("req.body operations");
      // console.log(req.body.operations);
      // @ts-ignore
      if (!req.isAuth || !req.userId) return;

      let userId = req.userId;
      let dest = "backgroundImgs/" + userId + "/";

      fs.readdirSync(dest).forEach((file: string) => {
        if (file !== newBackgroundImageName) {
          removeBackgroundImg(file, userId);
        }
      });

      // ======= for imgbb only
      let imgbbOptions = {
        apiKey: process.env.IMGBB,
        imagePath: dest + newBackgroundImageName,
        // 6 months
        expiration: 15552000,
      };

      imgbbUploader(imgbbOptions)
        .then((res: any) => {
          // console.log(res);

          let update: BackgroundImgUrl_i = {
            userId: userId,
            // @ts-ignore
            URL: res.url,
          };

          // @ts-ignore
          return BackgroundImgUrl.findOneAndUpdate({ userId: userId }, update, {
            // to return updated object
            new: true,
            upsert: true, // Make this update into an upsert,
            useFindAndModify: false,
          });
        })
        .catch((error: Error) => console.error(error));

      // ========

      // crucial!! cause page reload -> new img as a background
      res.status(201).json({
        message: "Product created successfully",
      });
    });
  }
);

app.use(
  "/graphql",
  // graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP((req, res) => {
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
  .catch(() => console.log("err"));

// @ts-ignore
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!4");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
