import fs = require("fs");
import path = require("path");

const BackgroundImgSchema = require("../../mongoModels/backgroundImgSchema");

// import { BackgroundImg } from "../../schema/types/backgroundImgType";

import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";

// import {
//   BackgroundImgType,
//   BackgroundImgFields,
// } from "../types/backgroundImgType";

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

// function removeBackgroundImg(fileName: string, userIdOrDemoId: string) {
//   console.log("removing background IMg");
//   return;

//   fs.unlink(
//     path.join(
//       __dirname,
//       "..",
//       "..",
//       "backgroundImgs",
//       userIdOrDemoId,
//       fileName
//     ),
//     (err: any) => {
//       if (err) console.error(err);
//     }
//   );
// }

export const backgroundImgUploadMutationField = {
  description: "Uploads an image.",
  // type: GraphQLBoolean,
  type: UploadedFileType,
  args: {
    image: {
      description: "Image file.",
      type: GraphQLUpload,
    },
  },
  // async resolve(parent: unknown, { image }: { image: any }, request: any) {
  // // async resolve(rootValue: any) {


  //   console.log("background img mutation runs");
    
  //   let operations = await request.operations;

 
  //   return operations;
  // },

};
