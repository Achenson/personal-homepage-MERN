
const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = graphql;

export interface BackgroundImg {
  userId: string;
  backgroundImg: string;
}

export const BackgroundImgFields = {
  
  userId: { type: GraphQLID },
  backgroundImg: { type: GraphQLString },
};


export const BackgroundImgType = new GraphQLObjectType({
  name: "BackgroundImg",
  fields: () => ({
    ...BackgroundImgFields,
  }),
});