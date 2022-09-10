import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import { GraphQLUpload } from "graphql-upload";

const UploadedFileType = new GraphQLObjectType({
  name: "UploadedFile",
  fields: {
    filename: { type: GraphQLString },
    mimetype: { type: GraphQLString },
    enconding: { type: GraphQLString },
    // createReadStream: {type: GraphQLObjectType}
  },
});

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
