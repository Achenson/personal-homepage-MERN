const graphql = require("graphql");
const { GraphQLObjectType } = graphql;

import { settingsQueryField } from "./settingsQuery";
import { bookmarksQueryField } from "./bookmarksQuery";
import { tabsQueryField } from "./tabsQuery";
import { backgroundImgQueryField } from "./backgroundImgQuery";
import { userQueryField } from "./userQuery";

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    settings: settingsQueryField,
    bookmarks: bookmarksQueryField,
    tabs: tabsQueryField,
    backgroundImg: backgroundImgQueryField,
    user: userQueryField,
  },
});
