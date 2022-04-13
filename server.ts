const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
import { graphqlHTTP } from "express-graphql";
// const { graphqlHTTP } = require("express-graphql");
const helmet = require("helmet");
const mongoose = require("mongoose");
const Parser = require("rss-parser");
import multer = require("multer");
const mkdirp = require("mkdirp");
const fs = require("fs");
const path = require("path");
const faviconFetch = require("favicon-fetch");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");

import User = require('./mongoModels/userSchema')
const createAccessToken = require("./schema/middleware/accessToken");
const createRefreshToken = require("./schema/middleware/refreshToken");
const sendRefreshToken = require("./schema/middleware/sendRefreshToken");
const isAuth = require("./schema/middleware/isAuth");


// const BackgroundImgSchema = require("../../mongoModels/BackgroundImgSchema");
const BackgroundImgSchema = require("./mongoModels/backgroundImgSchema");
import {
  diskStorage,
  FileFilterCallback,
  MulterError,
  Multer,
  Options,
} from "multer";
import { schema } from "./schema/schema";

import { testUserId } from "../personal-homepage-MERN/client/src/state/data/testUserId";
import { BackgroundImg } from "./schema/types/backgroundImgType";
let rssParser = new Parser();
// let upload = multer({dest: "uploads/"})

const app = express();

const port = 4000;

import { NextFunction, Request, Response } from "express";
import { addPath } from "graphql/jsutils/Path";
import { stripIgnoredCharacters } from "graphql";

// favicon test
/* let fetchTest1 = faviconFetch({ hostname: "wikipedia.org" });
console.log(fetchTest1);
let fetchTest2 = faviconFetch({ uri: "https://en.wikipedia.org/wiki/1986" });
console.log(fetchTest2); */

// let fetchTest2 = faviconFetch({ uri: "https://www.facebook.com/" });
// console.log(fetchTest2);

// ============

// app.use(helmet());
app.use(
  helmet({
    // to enable express-graphql playground
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:4000/graphql",
      "http://localhost:4000/fetch_rss",
      "http://localhost:4000/background_img",
    ],
    credentials: true,
  })
);


// app.use(isAuth);


//  parsing cookie only in the context of that particular route
app.use("/refresh_token", cookieParser())



app.post("/refresh_token", async (req: Request, res: Response) => {
  // 1. testing sending test cookie in request using postman
  // cookies -> add domain: localhost -> coookie name: jid
  // console.log(req.headers);

  console.log("refresh token app.post");
  
  // testing sending cookie after cookie-parser is applied
  console.log(req.cookies);

  const token = req.cookies.jid;

  if (!token) {
    return res.send({ ok: false, accessToken: null, userId: null });
  }

  let payload = null;

  // console.log(payload);
  // console.log("payload");
  

  try {
    // payload = jwt.verify(token, "secretKeyForRefreshToken");
    payload = jwt.verify(token, process.env.REFRESH);
  } catch (err) {
    console.log(err);
    console.log("refresh token error2");
    // return res.send({ ok: false, accessToken: "" });
    return res.send({ ok: false, accessToken: null, userId: null });
  }

  // token is valid
  // we can send access token
  // @ts-ignore
  const user = await User.findById(payload.userId);

  if (!user) {
    console.log("refresh token error3");
    // return res.send({ ok: false, accessToken: "" });
    return res.send({ ok: false, accessToken: null, userId: null });
  }

  // revoking tokens: tokenVersion == 0 when creating user
  // refreshTokens' tokenVersion == user.tokenVerssion
  // to invalidate user -> increment user's tokenVersion
  // when the user tries to refresh tokens(refreshing or after accessToken runs out),
  // his user.tokenVersion doesn't match the version from the refresh token in his cookies

  if (user.tokenVersion !== payload.tokenVersion) {
    console.log("invalid tokenVersion");

    // return res.send({ ok: false, accessToken: "", userId: "" });
    return res.send({ ok: false, accessToken: null, userId: null });
  }

  await sendRefreshToken(res, createRefreshToken(user));



  return res.send({
    ok: true,
    accessToken: createAccessToken(user),
    userId: payload.userId,
  });

  //  testing: send login mutation in graphql, get accessToken
  // testin2: take refresh cookie from res (sieć)
});


/* app.use(
  cors({
    origin: "*"
  })
); */

// fetching rss server-side
/* app.use("/fetch_rss/:rsslink", async (req: Request, res: Response) => {
  let response = await rssParser.parseURL(req.params.rsslink);
  // console.log(response);
  res.send(response);
}); */

app.use("/fetch_rss/:rsslink", async (req: Request, res: Response) => {

  console.log("fetching rss server");
  
  let response = await rssParser.parseURL(req.params.rsslink);
  // console.log(response);
  res.send({
    rssFetchData: response
  });
});

let newBackgroundImageName: string;


let userIdOrDemoId: string;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const authHeader = req.get("Authorization");
    // console.log(req.headers);
    // const authHeader = req.headers.authorisation;
  
    console.log("Storage multer");
    console.log(authHeader);

    // @ts-ignore
    // userIdOrDemoId = req.isAuth ? req.userId : testUserId 
    userIdOrDemoId = req.userId ? req.userId : testUserId 

    let dest = "backgroundImgs/" + userIdOrDemoId + "/";
    // mkdirp.sync(dest);
    cb(null, dest);
  },
  filename: function (req: any, file: any, cb: any) {
    let newFileName = Date.now() + "_" + file.originalname;
    cb(null, newFileName);
    newBackgroundImageName = newFileName;
  },
});

function fileFilter(
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    // cb(new Error("Only .jpg and .png files are accepted"));
    cb(new Error("Only .jpg and .png files are accepted"));
    return;
  }

  cb(null, true);
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

/* app.get("/background_img/:userId", (req: Request, res: Response) => {
  BackgroundImgSchema.findOne({ userId: testUserId }).then(
    (result: BackgroundImg) => {
      let response = {
        userId: result.userId,
        backgroundImg: result.backgroundImg,
      };

      res.status(200).json(response);
    }
  );
}); */

/* app.use("/fetch_rss/:rsslink", async (req: Request, res: Response) => {
  let response = await rssParser.parseURL(req.params.rsslink);
  // console.log(response);
  res.send(response);
});
 */

// uploading background image

app.use("/background_img", express.static("backgroundImgs"));

let backgroundImgUpload = upload.single("backgroundImg");

app.post(
  "/background_img",
  // upload.single("backgroundImg"),
  (req: any, res: Response) => {






    

    console.log("POST req.isAuth POST");
    console.log(req.isAuth);

    const authHeader = req.get("Authorization");
    // console.log(req.headers);
    // const authHeader = req.headers.authorisation;
  
    console.log("POST authHeader POST");
    console.log(authHeader);
    // console.log("req.headers backgroundImg");
    // console.log(req.headers);
  // const authHeader = req.headers.authorisation;
    


    backgroundImgUpload(req, res, function (multerErr) {
      if (multerErr) {
        if (multerErr instanceof multer.MulterError) {
          res.send({ error: multerErr.message });
          return;
        }
        // res.status(500).send({error: multerErr})
        // res.send(multerErr);
        res.send({ error: "Only .jpg and .png files are accepted" });

        return;
      }

      let newBackgroundImg = {
        userId: userIdOrDemoId,
        backgroundImg: req.file.path,
      };

      BackgroundImgSchema.replaceOne(
        { userId: userIdOrDemoId },
        newBackgroundImg,
        { upsert: true },
        (err: Error, backgroundImgProduct: BackgroundImg) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              error: err,
            });

            removeBackgroundImg(newBackgroundImageName);
            return;
          }

          let dest = "backgroundImgs/" + userIdOrDemoId + "/";

          fs.readdirSync(dest).forEach((file: string) => {
            // console.log(file);

            if (file !== newBackgroundImageName) {
              removeBackgroundImg(file);
            }
          });

          res.status(201).json({
            message: "Created product successfully",
            createdProduct: backgroundImgProduct,
          });
          // res.send(backgroundImgProduct)
          // res.send({message: "done"})
          // res.statusMessage = backgroundImgProduct.backgroundImg
          // res.send("aaaaaaaaaaaaaaaaaaaaa");
        }
      );

      // console.log(req);
      // console.log(req.file.path);

      /* let newBackgroundImg = new BackgroundImg({
      userId: testUserId,
      backgroundImg: req.file.path,
    }); */
    });
  }
);

/* let backgroundImgFiles = fs.readdirSync("backgroundImgs/" + testUserId);
console.log(backgroundImgFiles[0]); */

app.get("/background_img/:userId", (req: Request, res: Response) => {

  console.log("getting background img");
  
  let backgroundImgFiles = fs.readdirSync(
    "backgroundImgs/" + req.params.userId
  );

  /* let backgroundImgUrl = path.join(
    "backgroundImgs/" + req.params.userId + "/" + backgroundImgFiles[0]
  ); */

  let backgroundImgUrl =
    "background_img/" + req.params.userId + "/" + backgroundImgFiles[0];

  if (backgroundImgUrl) {
    res.status(201).json({
      backgroundImgUrl: backgroundImgUrl,
    });
    return;
  }

  res.status(500).json({
    error: "No background image available",
  });
});

app.get("/favicon/:faviconUrl", (req: Request, res: Response) => {
  console.log("getting favicon");
  
  let fetchFavicon = faviconFetch({
    uri: `${decodeURIComponent(req.params.faviconUrl)}`,
  });
  // console.log(fetchFavicon);

  if (fetchFavicon) {
    res.status(201).json({
      favicon: fetchFavicon,
    });
    return;
  }

  res.status(500).json({
    error: "No favicon available",
  });
});

/*  app.use((req: Request, res: Response, next: any) => {


// @ts-ignore
 req.customKey = "finally";
// @ts-ignore
// console.log(req.customKey);
next()

}) */

app.use(
  "/graphql",
  graphqlHTTP((req) => {
    return {
      schema: schema,
      graphiql: true,
      rootValue: { request: req },
    };
  })
);

/* 
=creating new bookmark


app.post(site url) {

 getting favicon using fetch-favicon

 fetch image using node js

//  calling another route??
 save to folder(multer? or saving directly fs?)

 save to db


 respond wiht a url from the server


}

*/

function removeBackgroundImg(fileName: string) {
  fs.unlink(
    path.join("backgroundImgs/" + userIdOrDemoId + "/", fileName),
    (err: any) => {
      if (err) console.error(err);
    }
  );
}

dotenv.config();

const MONGODB_CONNECTION_STRING = process.env.DB;

mongoose
  .connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  // .catch((err: Mon) => console.log(err));
  .catch(() => console.log("err"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!4");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
