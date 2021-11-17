const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const helmet = require("helmet");
const mongoose = require("mongoose");
const Parser = require("rss-parser");
const multer = require("multer");
const mkdirp = require("mkdirp");
const fs = require("fs");
const path = require("path");
// const BackgroundImgSchema = require("../../mongoModels/BackgroundImgSchema");
const BackgroundImgSchema = require("./mongoModels/backgroundImgSchema");
import { Multer } from "multer";
import { schema } from "./schema/schema";

import { testUserId } from "../personal-homepage-MERN/client/src/state/data/testUserId";
import { BackgroundImg } from "./schema/types/backgroundImgType";
let rssParser = new Parser();
// let upload = multer({dest: "uploads/"})

const app = express();

const port = 4000;

import { Request, Response } from "express";

// app.use(helmet());
app.use(
  helmet({
    // to enable express-graphql playground
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

/* app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:4000/graphql",
      "http://localhost:4000/fetch_rss",
      "http://localhost:4000/background_img/",
    ],
    credentials: true,
  })
);
 */
app.use(
  cors({
    origin: "*"
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
// fetching rss server-side
app.use("/fetch_rss/:rsslink", async (req: Request, res: Response) => {
  let response = await rssParser.parseURL(req.params.rsslink);
  // console.log(response);
  res.send(response);
});

let newBackgroundImageName: string;

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    let dest = "backgroundImgs/" + testUserId + "/";
    // mkdirp.sync(dest);
    cb(null, dest);
  },
  filename: function (req: any, file: any, cb: any) {
    let newFileName = Date.now() + "_" + file.originalname;
    cb(null, newFileName);
    newBackgroundImageName = newFileName;
  },
});

function fileFilter(req: any, file: any, cb: any) {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg and .png files are accepted"), false);
  }
}

const upload: Multer = multer({
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
app.use(
  "/background_img",
  upload.single("backgroundImg"),
  (req: any, res: Response) => {
    // console.log(req);
    // console.log(req.file.path);
    

    /* let newBackgroundImg = new BackgroundImg({
      userId: testUserId,
      backgroundImg: req.file.path,
    }); */

    let newBackgroundImg = {
      userId: testUserId,
      backgroundImg: req.file.path,
    };

    BackgroundImgSchema.replaceOne(
      { userId: testUserId },
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

        let dest = "backgroundImgs/" + testUserId + "/";

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
      }
    );
  }
);

function removeBackgroundImg(fileName: string) {
  fs.unlink(
    path.join("backgroundImgs/" + testUserId + "/", fileName),
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
