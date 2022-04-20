const graphql = require("graphql");

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

export const backgroundImgMutationField = {
  description: "Uploads an image.",
  type: GraphQLBoolean,
  args: {
    image: {
      description: "Image file.",
      type: GraphQLUpload,
    },
  },
  async resolve(parent: unknown, { image }: { image: any }) {

  
    const { filename, mimetype, createReadStream } = await image;
    const stream = createReadStream();
    // Promisify the stream and store the file, then…

    console.log("filename");
    console.log(filename);

    return true;
  },
  // resolve(rootValue: any) {
  //   // return rootValue.request.file;

  //   console.log("rootValue");
  //   console.log(rootValue);
  //   console.log(rootValue.request.file);
  // },
};
