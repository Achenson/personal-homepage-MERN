import React, { useState, useReducer, useEffect, Children } from "react";
import { useQuery } from "urql";
import { useQuery as useReactQuery } from "react-query";
import path from "path";

// import shallow from "zustand/shallow";

import Grid from "./LowerUI/Grid";
import Bookmark_newAndEdit from "./Shared/Bookmark_newAndEdit";
import NewTab from "./UpperUI/NewTab";
import ColorsSettings from "./UpperUI/ColorsSettings";
import UpperUI from "./UpperUI/UpperUI";
import BackgroundSettings from "./UpperUI/BackgroundSettings";
import GlobalSettings from "./UpperUI/GlobalSettings";
import Profile from "./UpperUI/Profile";
import ModalWrap from "./UpperUI/ModalWrap";

// import { useGlobalSettings } from "../state/hooks/defaultSettingsHooks";
// import { useBackgroundColor } from "../state/hooks/colorHooks";

import { initUpperVisState } from "../context/upperVisInitState";
import { upperVisReducer } from "../context/upperVisReducer";
import { useWindowSize } from "../utils/funcs and hooks/useWindowSize";
import { UpperUiContext } from "../context/upperUiContext";
import { DbContext } from "../context/dbContext";
import { BackgroundImgContext } from "../context/backgroundImgContext";

import { SettingsDatabase_i } from "../../../schema/types/settingsType";
import { TabsQuery, BookmarksQuery } from "../graphql/graphqlQueries";

import { testUserId } from "../state/data/testUserId";

import {
  BackgroundImgContext_i,
  DbContext_i,
  SingleBookmarkData,
  SingleTabData,
} from "../utils/interfaces";
import { BookmarkDatabase_i } from "../../../schema/types/bookmarkType";
import { TabDatabase_i } from "../../../schema/types/tabType";

interface Props {
  globalSettings: SettingsDatabase_i;
}

function Main({ globalSettings }: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  // const backgroundColor = useBackgroundColor((state) => state.backgroundColor);
  const backgroundColor = globalSettings.backgroundColor;

  const [upperVisState, upperVisDispatch] = useReducer(
    upperVisReducer,
    initUpperVisState
  );

  let upperUiValue = { upperVisState, upperVisDispatch };

  const [tabType, setTabType] = useState<"folder" | "note" | "rss">("folder");

  const [paddingRight, setPaddingRight] = useState(false);

  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width < 505) {
        upperVisDispatch({ type: "XS_SIZING_TRUE" });
      } else {
        upperVisDispatch({ type: "XS_SIZING_FALSE" });
      }
    }
  }, [windowSize.width]);

  /* for plain color background mode only!
 for image background mode scrollbar is visible but disabled with react-remove-scroll 
 to prevent background image flickering
 */
  const [scrollbarWidth, setScrollbarWidth] = useState(
    //  () => (windowSize.width as number) >= 400 ? 17 : 0
    0
  );

  const [backgroundImgKey, setBackgroundImgKey] = useState(
    "initial"
  )

/*   useEffect( () => {

    console.log("backgroundImgKey");
    console.log(backgroundImgKey);
    
  }, [backgroundImgKey]) */

  /*  const [customBackgroundImg, setCustomBackgroundImg] = useState(false);

  useEffect(() => {
    if (
      globalSettings.defaultImage === "customBackground" &&
      globalSettings.picBackground
    ) {
      setCustomBackgroundImg(true);
      console.log("true");
    } else {
      setCustomBackgroundImg(false);
      console.log("false");
    }
  }, [globalSettings.defaultImage, globalSettings.picBackground]); */

  useEffect(() => {
    if (document.body.style.overflow === "visible") {
      setScrollbarWidth(
        window.innerWidth - document.documentElement.clientWidth
      );
    }
  }, [
    setScrollbarWidth,
    document.body.style.overflow,
    window.innerWidth,
    document.documentElement.clientWidth,
  ]);

  useEffect(() => {
    if (
      upperVisState.colorsSettingsVis ||
      upperVisState.backgroundSettingsVis ||
      upperVisState.settingsVis ||
      upperVisState.profileVis ||
      upperVisState.newBookmarkVis ||
      upperVisState.newTabVis
    ) {
      if (
        document.documentElement.scrollHeight >
        document.documentElement.clientHeight
      ) {
        if (!globalSettings.picBackground) {
          document.body.style.overflow = "hidden";
        } else {
          // for correct display after toggling pic background
          document.body.style.overflow = "visible";
        }
        setPaddingRight(true);
      }

      return;
    }

    document.body.style.overflow = "visible";

    setPaddingRight(false);
  }, [
    upperVisState.colorsSettingsVis,
    upperVisState.backgroundSettingsVis,
    upperVisState.settingsVis,
    upperVisState.profileVis,
    upperVisState.newBookmarkVis,
    upperVisState.newTabVis,
    document.body.style.overflow,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    globalSettings.picBackground,
  ]);

  let backgroundImgValue: BackgroundImgContext_i = {
    currentBackgroundImgKey: backgroundImgKey,
    updateCurrentBackgroundImgKey: setBackgroundImgKey
  };


  const { data, status } = useReactQuery(
    [`backgroundImg_${testUserId}`, backgroundImgKey],
    fetchBackgroundImg,
    {
      // staleTime: 2000,
      // cacheTime: 10,
      onSuccess: () => {
        console.log("data fetched with no problems");
        // console.log(data);
      },
    }
  );

  async function fetchBackgroundImg() {
    let response = await fetch(
      "http://localhost:4000/background_img/" + testUserId
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  }

  let backgroundImgUrl: string;

  if (status === "success") {
    /* console.log("data");
    console.log(data); */

    backgroundImgUrl = data.backgroundImgUrl;
  }

  const [tabResults, reexecuteTabs] = useQuery({
    query: TabsQuery,
    variables: { userId: testUserId },
    // requestPolicy: 'cache-and-network',
  });

  const {
    data: data_tabs,
    fetching: fetching_tabs,
    error: error_tabs,
  } = tabResults;

  const [bookmarkResults, reexecuteBookmarks] = useQuery({
    query: BookmarksQuery,
    variables: { userId: testUserId },
    // requestPolicy: 'cache-and-network',
  });

  const {
    data: data_bookmarks,
    fetching: fetching_bookmarks,
    error: error_bookmarks,
    stale: stale_bookmarks,
  } = bookmarkResults;

  if (fetching_tabs) return <p>Loading...</p>;
  if (error_tabs) return <p>Oh no... {error_tabs.message}</p>;

  // let tabs: SingleTabData[] = data_tabs.tabs;
  let tabs: TabDatabase_i[] = data_tabs.tabs;

  if (fetching_bookmarks) return <p>Loading...</p>;
  /* setTimeout(() => {
    if (fetching_bookmarks) return <p>Loading...</p>;
  }, 1000); */
  if (error_bookmarks) return <p>Oh no... {error_bookmarks.message}</p>;

  // let bookmarks: SingleBookmarkData[] = data_bookmarks.bookmarks;
  let bookmarks: BookmarkDatabase_i[] = data_bookmarks.bookmarks;

  let dbValue: DbContext_i = {
    bookmarks,
    tabs,
    stale_bookmarks,
    reexecuteBookmarks,
    reexecuteTabs,
  };

  let paddingProps = {
    mainPaddingRight: paddingRight,
    scrollbarWidth,
  };

  function renderBackgroundImg(picBackground: boolean, defaultImage: string) {
    if (
      picBackground &&
      defaultImage === "customBackground" &&
      backgroundImgUrl
    ) {
      // return `url(http://localhost:4000/background_img/618bc0f9518920c0f6296748/1637157771955_testWallpaper.jpg)`;

      // let parsedUrl = path.join("http://localhost:4000/" + backgroundImgUrl)
      let parsedUrl = "http://localhost:4000/" + backgroundImgUrl;
      // console.log(parsedUrl);

      // return `url(http://localhost:4000/${backgroundImgUrl})`;
      // return `url(${parsedUrl})`;
      return `url(${parsedUrl})`;
    }
    return undefined;
  }

  return (
    <DbContext.Provider value={dbValue}>
      <BackgroundImgContext.Provider value={backgroundImgValue}>
        <UpperUiContext.Provider value={upperUiValue}>
          <main
            className={`relative min-h-screen
            ${
              globalSettings.picBackground
                ? `bg-${globalSettings.defaultImage}`
                : `bg-${backgroundColor}`
            }
             bg-cover bg-fixed`}
            style={{
              paddingRight: `${
                paddingRight && !globalSettings.picBackground
                  ? `${scrollbarWidth}px`
                  : ""
              }`,
              backgroundImage: renderBackgroundImg(
                globalSettings.picBackground,
                globalSettings.defaultImage
              ),
            }}
          >
            {upperVisState.newTabVis && (
              <ModalWrap globalSettings={globalSettings}>
                <NewTab
                  tabType={tabType}
                  // tabs={tabs}
                  // bookmarks={bookmarks}
                  globalSettings={globalSettings}
                  {...paddingProps}
                />
              </ModalWrap>
            )}
            {upperVisState.newBookmarkVis && (
              <ModalWrap globalSettings={globalSettings}>
                <Bookmark_newAndEdit
                  bookmarkComponentType={"new_upperUI"}
                  // tabs={tabs}
                  // bookmarks={bookmarks}
                  globalSettings={globalSettings}
                  {...paddingProps}
                />
              </ModalWrap>
            )}
            {upperVisState.backgroundSettingsVis && (
              <ModalWrap globalSettings={globalSettings}>
                <BackgroundSettings
                  globalSettings={globalSettings}
                  {...paddingProps}
                />
              </ModalWrap>
            )}
            {upperVisState.settingsVis && (
              <ModalWrap globalSettings={globalSettings}>
                <GlobalSettings
                  globalSettings={globalSettings}
                  {...paddingProps}
                />
              </ModalWrap>
            )}
            {upperVisState.colorsSettingsVis && (
              <ModalWrap globalSettings={globalSettings}>
                <ColorsSettings
                  globalSettings={globalSettings}
                  {...paddingProps}
                />
              </ModalWrap>
            )}
            {upperVisState.profileVis && (
              <ModalWrap globalSettings={globalSettings}>
                <Profile globalSettings={globalSettings} {...paddingProps} />
              </ModalWrap>
            )}
            <UpperUI />
            <Grid
              setTabType={setTabType}
              globalSettings={globalSettings}
              // bookmarks={bookmarks}
              // tabs={tabs}
              // staleBookmarks={stale_bookmarks}
            />
          </main>
        </UpperUiContext.Provider>
      </BackgroundImgContext.Provider>
    </DbContext.Provider>
  );
}

export default Main;
