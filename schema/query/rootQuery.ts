const graphql = require("graphql");

import { settingsQueryField } from "./settingsQuery";
import { bookmarksQueryField } from "./bookmarksQuery";
import { tabsQueryField } from "./tabsQuery";
import { backgroundImgQueryField } from "./backgroundImgQuery";
import {rssFetchQueryField} from "./rssFetchQuery"

const { GraphQLObjectType, GraphQLID } = graphql;

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    settings: settingsQueryField,
    bookmarks: bookmarksQueryField,
    tabs: tabsQueryField,
    backgroundImg: backgroundImgQueryField,
    rssFetch: rssFetchQueryField
  },
});
