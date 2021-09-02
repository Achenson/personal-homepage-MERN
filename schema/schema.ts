const graphql = require("graphql");

const Settings = require("../mongoModels/settings.ts");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLBoolean,
} = graphql;

const SettingsType = new GraphQLObjectType({
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

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: SettingsType,
      args: { userId: { type: GraphQLID } },
      resolve(_source: unknown, { userId }: { userId: string }) {
        return Settings.findOne({ userId: userId });
      },
    },
  },
});

interface Settings_i {
  userId: string;
  picBackground: boolean;
  defaultImage: string;
  oneColorForAllCols: boolean;
  limitColGrowth: boolean;
  hideNonDeletable: boolean;
  disableDrag: boolean;
  numberOfCols: 1 | 2 | 3 | 4;
}

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    changeSettings: {
      type: SettingsType,
      args: {
        // userId: { type: new GraphQLNonNull(GraphQLString) }, ?
        userId: { type: GraphQLID },
        picBackground: { type: GraphQLBoolean },
        defaultImage: { type: GraphQLString },
        oneColorForAllCols: { type: GraphQLBoolean },
        limitColGrowth: { type: GraphQLBoolean },
        hideNonDeletable: { type: GraphQLBoolean },
        disableDrag: { type: GraphQLBoolean },
        numberOfCols: { type: GraphQLInt },
      },
      resolve(_source: unknown, args: Settings_i) {
        let update = {
          picBackground: args.picBackground,
          defaultImage: args.defaultImage,
          oneColorForAllCols: args.oneColorForAllCols,
          limitColGrowth: args.limitColGrowth,
          hideNonDeletable: args.hideNonDeletable,
          disableDrag: args.disableDrag,
          numberOfCols: args.numberOfCols,
        };

        return Settings.findOneAndUpdate({ userId: args.userId }, update, {
          // to return updated object
          new: true,
          upsert: true, // Make this update into an upsert,
          useFindAndModify: false,
        });
      },
    },
  },
});

/* 
mutation {
  changeSettings(userId: "123", picBackground: true,
        defaultImage: "img" ,
        oneColorForAllCols: true,
        limitColGrowth: true,
        hideNonDeletable: true,
        disableDrag: true,
        numberOfCols: 2,
) {
        picBackground,
        defaultImage,
        oneColorForAllCols,
        limitColGrowth,
        hideNonDeletable,
        disableDrag,
        numberOfCols
  }
}

*/

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
