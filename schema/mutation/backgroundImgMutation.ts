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

const UploadedFileType = new GraphQLObjectType({
  name: 'UploadedFile',
  fields: {
    filename: { type: GraphQLString },
    mimetype: { type: GraphQLString },
    enconding: {type: GraphQLString}
    // createReadStream: {type: GraphQLObjectType}

  }
})

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

    let file= await rootValue.request.body.variables?.file?.file;

    console.log(file);
    
    
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
