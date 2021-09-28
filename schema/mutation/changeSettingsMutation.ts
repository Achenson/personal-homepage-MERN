const graphql = require("graphql");
const Settings = require("../../mongoModels/settingsSchema");


import { SettingsFields, SettingsType, Settings_i } from "../types/settingsType";

export const changeSettingsMutationField = {
  type: SettingsType,
  args: {
    // userId: { type: new GraphQLNonNull(GraphQLString) }, 
    ...SettingsFields
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

    return Settings.findOneAndUpdate({userId: args.userId}, update, {
      // to return updated object
      new: true,
      upsert: false, // Make this update into an upsert,
      useFindAndModify: false,
    });
  },
};
