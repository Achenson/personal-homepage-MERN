const graphql = require("graphql");
import multer = require("multer");
const fs = require("fs");
const path = require("path");

const BackgroundImgSchema = require("../../mongoModels/backgroundImgSchema");

import { BackgroundImg } from "../../schema/types/backgroundImgType";

import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";

import {
  BackgroundImgType,
  BackgroundImgFields,
} from "../types/backgroundImgType";

// const UploadedFileType = new GraphQLObjectType({
//   name: "UploadedFile",
//   fields: {
//     originalname: { type: GraphQLString },
//     mimetype: { type: GraphQLString },
//   },
// });

const UploadedFileType = new GraphQLObjectType({
  name: "UploadedFile",
  fields: {
    filename: { type: GraphQLString },
    mimetype: { type: GraphQLString },
    enconding: { type: GraphQLString },
    // createReadStream: {type: GraphQLObjectType}
  },
});

let newBackgroundImageName: string;

const storage = multer.diskStorage({
  destination: function (req: any, file, cb) {
    const authHeader = req.get("Authorization");
    // console.log(req.headers);
    // const authHeader = req.headers.authorisation;

    console.log("Storage multer");
    console.log(authHeader);

    // @ts-ignore
    // userIdOrDemoId = req.isAuth ? req.userId : testUserId

    // userIdOrDemoId = req.userId ? req.userId : testUserId

    // let dest = "backgroundImgs/" + userIdOrDemoId + "/";

    // let dest = "/../../backgroundImgs/" + req.userId + "/";
    let dest = path.join(__dirname, "..", "..", "backgroundImgs", req.userId);
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

function removeBackgroundImg(fileName: string, userIdOrDemoId: string) {
  fs.unlink(
    path.join(
      __dirname,
      "..",
      "..",
      "backgroundImgs",
      userIdOrDemoId,
      fileName
    ),
    (err: any) => {
      if (err) console.error(err);
    }
  );
}

let backgroundImgUpload = upload.single("backgroundImg");

export const backgroundImgMutationField = {
  description: "Uploads an image.",
  // type: GraphQLBoolean,
  type: UploadedFileType,
  args: {
    image: {
      description: "Image file.",
      type: GraphQLUpload,
    },
  },
  // async resolve(parent: unknown, { image }: { image: any }) {
  async resolve(rootValue: any) {
    let file = await rootValue.request.body.variables?.file?.file;

    console.log(file);

    let req = rootValue.request;
    let res = rootValue.response;

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
        // userId: userIdOrDemoId,
        userId: req.userId,
        backgroundImg: file,
      };

      BackgroundImgSchema.replaceOne(
        // { userId: userIdOrDemoId },
        { userId: req.userId },
        newBackgroundImg,
        { upsert: true },
        (err: Error, backgroundImgProduct: BackgroundImg) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              error: err,
            });

            removeBackgroundImg(newBackgroundImageName, req.userId);
            return;
          }

          // let dest = "backgroundImgs/" + userIdOrDemoId + "/";

          // let dest = "/../../backgroundImgs/" + req.userId + "/";
          let dest = path.join(
            __dirname,
            "..",
            "..",
            "backgroundImgs",
            req.userId
          );

          fs.readdirSync(dest).forEach((file: string) => {
            // console.log(file);

            if (file !== newBackgroundImageName) {
              removeBackgroundImg(file, req.userId);
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
    // console.log("image");
    // console.log(image);

    // const { filename, mimetype, createReadStream } = await file;

    // console.log(filename);

    // // console.log("step 2");

    // const stream = createReadStream();
    // // // Promisify the stream and store the file, then…

    // // console.log("filename");
    // // console.log(filename);
    // console.log(stream);

    // return true;

    return file;
  },
  // resolve(rootValue: any) {
  //   // return rootValue.request.file;

  //   console.log("rootValue");
  //   console.log(rootValue);
  //   console.log(rootValue.request.file);
  // },
};
