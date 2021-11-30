const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const helmet = require("helmet");
const mongoose = require("mongoose");
const Parser = require("rss-parser");
import multer = require("multer");
const mkdirp = require("mkdirp");
const fs = require("fs");
const path = require("path");
const faviconFetch = require("favicon-fetch");

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

import { Request, Response } from "express";

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

/* app.use(
  cors({
    origin: "*"
  })
); */

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
  destination: function (req, file, cb) {
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
  let fetchFavicon = faviconFetch({ uri: `${decodeURIComponent(req.params.faviconUrl)}` });
  console.log(fetchFavicon);

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
