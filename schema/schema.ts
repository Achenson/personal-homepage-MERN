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
      resolve(parent, args, { req, res }) {
        return Settings.findOne({ userId: args.userId });
      },
    },
  },
});

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
      resolve(parent, args, { req, res }) {
        let update = {
          picBackground: args.picBackground,
          defaultImage: args.defaultImage,
          oneColorForAllCols: args.oneColorForAllCols,
          limitColGrowth: args.limitColGrowth,
          hideNonDeletable: args.hideNonDeletable,
          disableDrag: args.disableDrag,
          numberOfCols: args.numberOfCols,
        };

        return Settings.findOneAndUpdtate({ userId: args.userId }, update, {
          // to return updated object
          new: true,
          upsert: true, // Make this update into an upsert,
          useFindAndModify: false,
        });
      },
    },
  },
});
