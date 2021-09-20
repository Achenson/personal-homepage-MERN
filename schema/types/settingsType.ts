const graphql = require("graphql");

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
  } = graphql;

  export interface Settings_i {
    userId: string;
    picBackground: boolean;
    defaultImage: string;
    oneColorForAllCols: boolean;
    limitColGrowth: boolean;
    hideNonDeletable: boolean;
    disableDrag: boolean;
    numberOfCols: 1 | 2 | 3 | 4;
  }

  export const SettingsType = new GraphQLObjectType({
    name: "Settings",
    fields: () => ({
      id: { type: GraphQLID },
      userId: { type: GraphQLID },
      picBackground: { type: GraphQLBoolean },
      defaultImage: { type: GraphQLString },
      oneColorForAllCols: { type: GraphQLBoolean },
      limitColGrowth: { type: GraphQLBoolean },
      hideNonDeletable: { type: GraphQLBoolean },
      disableDrag: { type: GraphQLBoolean },
      numberOfCols: { type: GraphQLInt },
    }),
  });