import graphql = require("graphql");
const { GraphQLObjectType, GraphQLString } = graphql;

const BackgroundImgFields = {
  backgroundImgUrl: { type: GraphQLString },
};

// for urls of external api for image storage
export interface BackgroundImgUrl_i {
  userId: string;
  URL: string
}

export const BackgroundImgType = new GraphQLObjectType({
  name: "BackgroundImg",
  fields: () => ({
    ...BackgroundImgFields,
  }),
});
