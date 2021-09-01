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
    id: GraphQLID,
    userId: GraphQLID,
    picBackground: GraphQLBoolean,
    defaultImage: GraphQLString,
    oneColorForAllCols: GraphQLBoolean,
    limitColGrowth: GraphQLBoolean,
    hideNonDeletable: GraphQLBoolean,
    disableDrag: GraphQLBoolean,
    numberOfCols: GraphQLInt,
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: SettingsType,
      args: { userId: GraphQLID },
      resolve(_source: unknown, { userId }: { userId: string }) {
        return Settings.findOne({ userId: userId });
      },
    },
  },
});

interface Settings {
  userId: string,
  picBackground: boolean,
  defaultImage:string ,
  oneColorForAllCols: boolean,
  limitColGrowth: boolean,
  hideNonDeletable: boolean,
  disableDrag: boolean,
  numberOfCols: 1|2|3|4,
}

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    changeSettings: {
      type: SettingsType,
      args: {
        // userId: { type: new GraphQLNonNull(GraphQLString) }, ?
        userId: GraphQLID,
        picBackground: GraphQLBoolean,
        defaultImage: GraphQLString ,
        oneColorForAllCols: GraphQLBoolean,
        limitColGrowth: GraphQLBoolean,
        hideNonDeletable: GraphQLBoolean,
        disableDrag: GraphQLBoolean,
        numberOfCols: GraphQLInt,
      },
      resolve(_source: unknown, args: Settings) {
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
