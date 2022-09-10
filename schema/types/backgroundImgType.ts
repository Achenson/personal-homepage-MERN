import graphql = require("graphql");
const { GraphQLObjectType, GraphQLString } = graphql;

const BackgroundImgFields = {
  backgroundImgUrl: { type: GraphQLString },
};

export const BackgroundImgType = new GraphQLObjectType({
  name: "BackgroundImg",
  fields: () => ({
    ...BackgroundImgFields,
  }),
});
