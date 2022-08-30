import React from "react";
import { useQuery } from "urql";
import shallow from "zustand/shallow";

import Main from "./Main";

import {
  TabsQuery,
  BookmarksQuery,
  SettingsQuery,
} from "../graphql/graphqlQueries";
// import { testUserId } from "../state/data/testUserId";
// import { useAuthContext } from "../context/authContext";
import { useAuth } from "../state/hooks/useAuth";
import { useGlobalSettings } from "../state/hooks/defaultSettingsHooks";
import { useTabs } from "../state/hooks/useTabs";
import { useBookmarks } from "../state/hooks/useBookmarks";

import { BookmarkDatabase_i } from "../../../schema/types/bookmarkType";
import { TabDatabase_i } from "../../../schema/types/tabType";

import {
  // AuthContextObj_i,
  // AuthContext_i,
  // BackgroundImgContext_i,
  DbContext_i,
  GlobalSettingsState,
  SingleBookmarkData,
  SingleTabData,
} from "../utils/interfaces";

// component purpose: to provide globalSetting as a prop, because
// in Main a useEffect depends on it - globalSettins needs to be defined right away
function MainWrapper(): JSX.Element {
  const authContext = useAuth();
  const globalSettingsNotAuth = useGlobalSettings((state) => state, shallow);

  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);

  let userIdOrNoId: string | null;

  userIdOrNoId =
    authContext.isAuthenticated && authContext.authenticatedUserId
      ? authContext.authenticatedUserId
      : null;

  const [settingsResults] = useQuery({
    query: SettingsQuery,
    variables: { userId: userIdOrNoId },
    pause: !userIdOrNoId,
  });

  const [tabResults, reexecuteTabs] = useQuery({
    query: TabsQuery,
    // variables: { userId: authContext.isAuthenticated ? authContext.authenticatedUserId : testUserId },
    variables: { userId: userIdOrNoId },
    pause: !userIdOrNoId,
    // requestPolicy: 'cache-and-network',
  });

  const {
    data: data_tabs,
    fetching: fetching_tabs,
    error: error_tabs,
  } = tabResults;

  const [bookmarkResults, reexecuteBookmarks] = useQuery({
    query: BookmarksQuery,
    variables: { userId: userIdOrNoId },
    pause: !userIdOrNoId,
    // requestPolicy: 'cache-and-network',
  });

  const {
    data: data_bookmarks,
    fetching: fetching_bookmarks,
    error: error_bookmarks,
    stale: stale_bookmarks,
  } = bookmarkResults;

  const { data, fetching, error } = settingsResults;

  if (fetching_tabs) return <p>Loading...</p>;
  if (error_tabs) return <p>Oh no... {error_tabs.message}</p>;
  if (!data_tabs?.tabs) return <p>Loading...</p>;

  if (fetching_bookmarks) return <p>Loading...</p>;
  if (error_bookmarks) return <p>Oh no... {error_bookmarks.message}</p>;
  if (!data_bookmarks?.bookmarks) return <p>Loading data...</p>;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  // let tabs: TabDatabase_i[] | SingleTabData[];
  // tabs = userIdOrNoId ? data_tabs.tabs : tabsNotAuth;

  // let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  // bookmarks = userIdOrNoId ? data_bookmarks.bookmarks : bookmarksNotAuth;

  let globalSettings: GlobalSettingsState;
  globalSettings = userIdOrNoId ? data.settings : globalSettingsNotAuth;

  return (
    <Main
      globalSettings={globalSettings}
      tabsDb={userIdOrNoId ? data_tabs.tabs : null}
      bookmarksDb= {userIdOrNoId ? data_bookmarks.bookmarks : null}
    />
  );
}

export default MainWrapper;
