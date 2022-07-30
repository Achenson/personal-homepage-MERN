import React, { useState, useReducer, useEffect, Children } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useQuery } from "urql";
// import { useQuery as useReactQuery } from "react-query";
import path from "path";

// import shallow from "zustand/shallow";

import Grid from "./LowerUI/Grid";
import Bookmark_newAndEdit from "./Shared/Bookmark_newAndEdit";
import NewTab from "./UpperUI/NewTab";
import ColorsSettings from "./UpperUI/ColorsSettings";
import UpperUI from "./UpperUI/UpperUI";
import BackgroundSettings from "./UpperUI/BackgroundSettings";
import GlobalSettings from "./UpperUI/GlobalSettings";
import LoginRegister from "../components/AuthRoutes/LoginRegister";
// import Profile from "./UpperUI/Profile";
import ModalWrap from "./UpperUI/ModalWrap";
import PublicRoute from "./AuthRoutes/PublicRoute";
import PrivateRoute from "./AuthRoutes/PrivateRoute";
import MainRoute from "./MainRoute";

import Login from "./AuthRoutes/Login_TO_CANCEL";
import Register from "./AuthRoutes/Register_TO_CANCEL";

// import { useGlobalSettings } from "../state/hooks/defaultSettingsHooks";
// import { useBackgroundColor } from "../state/hooks/colorHooks";

import { initUpperVisState } from "../context/upperVisInitState";
import { upperVisReducer } from "../context/upperVisReducer";
import { useWindowSize } from "../utils/funcs and hooks/useWindowSize";
import { UpperUiContext } from "../context/upperUiContext";
import { DbContext } from "../context/dbContext";
import { BackgroundImgContext } from "../context/backgroundImgContext";
// import { useAuthContext } from "../context/authContext";
import { useAuth } from "../state/hooks/useAuth";

import { useTabs } from "../state/hooks/useTabs";
import { useBookmarks } from "../state/hooks/useBookmarks";

import { SettingsDatabase_i } from "../../../schema/types/settingsType";
import {
  TabsQuery,
  BookmarksQuery,
  BackgroundImgQuery,
} from "../graphql/graphqlQueries";

// import { testUserId } from "../state/data/testUserId";

import {
  AuthContextObj_i,
  AuthContext_i,
  BackgroundImgContext_i,
  DbContext_i,
  SingleBookmarkData,
  SingleTabData,
} from "../utils/interfaces";
import { BookmarkDatabase_i } from "../../../schema/types/bookmarkType";
import { TabDatabase_i } from "../../../schema/types/tabType";
import UserProfile from "./AuthRoutes/UserProfile";
import PasswordForgotten from "./AuthRoutes/PasswordForgotten";
import ForgottenPassChange from "./AuthRoutes/ForgottenPassChange";

interface Props {
  globalSettings: SettingsDatabase_i;
}

function Main({ globalSettings }: Props): JSX.Element {
  const authContext = useAuth();
  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);

  let userIdOrNoId: string | null;
  userIdOrNoId =
    authContext.authenticatedUserId && authContext.isAuthenticated
      ? authContext.authenticatedUserId
      : null;

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

  const [backgroundImgKey, setBackgroundImgKey] = useState("initial");

  // after successful register, after successful account deletion
  // const [loginNotification, setLoginNotification] = useState<string | null>(
  //   null
  // );

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

  // useEffect( () => {
  //   setLoginNotification(null)
  // }, [])

  let backgroundImgValue: BackgroundImgContext_i = {
    currentBackgroundImgKey: backgroundImgKey,
    updateCurrentBackgroundImgKey: setBackgroundImgKey,
  };

  // const { data, status } = useReactQuery(
  //   [`backgroundImg_${userIdOrDemoId}`, backgroundImgKey],
  //   fetchBackgroundImg,
  //   {
  //     // staleTime: 2000,
  //     // cacheTime: 10,
  //     onSuccess: () => {
  //       console.log("data fetched with no problems");
  //       // console.log(data);
  //     },
  //   }
  // );

  const [backgroundImgResults, reexecuteBackgroundImg] = useQuery({
    query: BackgroundImgQuery,
    // variables: { userId: authContext.isAuthenticated ? authContext.authenticatedUserId : testUserId },
    variables: { userId: userIdOrNoId },
    pause: !userIdOrNoId,
    // requestPolicy: 'cache-and-network',
  });

  const {
    data: data_backgroundImg,
    fetching: fetching_backgroundImg,
    error: error_backgroundImg,
  } = backgroundImgResults;

  // async function fetchBackgroundImg() {
  //   let response = await fetch(
  //     "http://localhost:4000/background_img/" + userIdOrDemoId
  //   );

  //   if (!response.ok) {
  //     throw new Error("Network response was not ok");
  //   }

  //   return response.json();
  // }

  // something has to be assigned, otherwise -> ts error in MainRoute component
  // let backgroundImgUrl: string | null = "";
  let backgroundImgUrl: string | null = null;

  // if (status === "success") {
  //   /* console.log("data");
  //   console.log(data); */

  //   backgroundImgUrl = data.backgroundImgUrl;
  // }

  if (data_backgroundImg) {
    console.log("data_background");
    console.log(data_backgroundImg);
    console.log(data_backgroundImg.backgroundImg);

    // if(data_backgroundImg.backgroundImg.backgroundImgUrl) {
    backgroundImgUrl = data_backgroundImg?.backgroundImg?.backgroundImgUrl;

    // } else {
    //   backgroundImgUrl = "fsfsgsdg"
    // }
  }

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

  if (fetching_tabs) return <p>Loading...</p>;
  if (error_tabs) return <p>Oh no... {error_tabs.message}</p>;

  // let tabs: SingleTabData[] = data_tabs.tabs;
  // let tabs: TabDatabase_i[] = data_tabs.tabs;
  let tabs: TabDatabase_i[] | SingleTabData[];

  tabs = userIdOrNoId ? data_tabs.tabs : tabsNotAuth;

  if (fetching_bookmarks) return <p>Loading...</p>;
  /* setTimeout(() => {
    if (fetching_bookmarks) return <p>Loading...</p>;
  }, 1000); */
  if (error_bookmarks) return <p>Oh no... {error_bookmarks.message}</p>;

  // let bookmarks: SingleBookmarkData[] = data_bookmarks.bookmarks;
  // let bookmarks: BookmarkDatabase_i[] = data_bookmarks.bookmarks;
  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  bookmarks = userIdOrNoId ? data_bookmarks.bookmarks : bookmarksNotAuth;

  // let dbValue: DbContext_i = {
  //   bookmarks,
  //   tabs,
  //   stale_bookmarks,
  //   reexecuteBookmarks,
  //   reexecuteTabs,
  // };

  let dbValue: DbContext_i | undefined;

  dbValue = userIdOrNoId ? {
    bookmarks: bookmarks as BookmarkDatabase_i[],
    tabs: tabs as TabDatabase_i[],
    stale_bookmarks,
    reexecuteBookmarks,
    reexecuteTabs,
  } : undefined

  let paddingProps = {
    mainPaddingRight: paddingRight,
    scrollbarWidth,
  };

  // function renderBackgroundImg(picBackground: boolean, defaultImage: string) {
  //   if (
  //     picBackground &&
  //     defaultImage === "customBackground" &&
  //     backgroundImgUrl
  //   ) {
  //     // return `url(http://localhost:4000/background_img/618bc0f9518920c0f6296748/1637157771955_testWallpaper.jpg)`;

  //     // let parsedUrl = path.join("http://localhost:4000/" + backgroundImgUrl)
  //     let parsedUrl = "http://localhost:4000/" + backgroundImgUrl;
  //     // console.log(parsedUrl);

  //     // return `url(http://localhost:4000/${backgroundImgUrl})`;
  //     // return `url(${parsedUrl})`;
  //     return `url(${parsedUrl})`;
  //   }
  //   return undefined;
  // }

  return (
    // <AuthContext.Provider value={authValue}>
    <DbContext.Provider value={dbValue}>
      <BackgroundImgContext.Provider value={backgroundImgValue}>
        <UpperUiContext.Provider value={upperUiValue}>
          <BrowserRouter>
            <Routes>
              {/* <Route path="/" element={<MainWrapper />}> */}
              <Route
                path="/"
                element={
                  <MainRoute
                    backgroundImgUrl={backgroundImgUrl}
                    backgroundImgResults={backgroundImgResults}
                    globalSettings={globalSettings}
                    paddingRight={paddingRight}
                    setTabType={setTabType}
                    tabType={tabType}
                    reexecuteBackgroundImg={reexecuteBackgroundImg}
                    upperVisState={upperVisState}
                    userIdOrNoId={userIdOrNoId}
                    // userIdOrNoId={userIdOrNoId}
                    // setLoginNotification={setLoginNotification}
                    {...paddingProps}
                  />
                }
              />
              {/* <CustomRoute
                isAuthenticated={authContext.isAuthenticated}
                path="/login-register"
                component={LoginRegister}
              /> */}

              <Route
                // isAuthenticated={authContext.isAuthenticated}
                path="/login-register"
                element={
                  // not possible to access if logged in!
                  <PublicRoute isAuthenticated={authContext.isAuthenticated}>
                    <LoginRegister
                      mainPaddingRight={paddingRight}
                      scrollbarWidth={scrollbarWidth}
                      globalSettings={globalSettings}
                      // loginNotification={loginNotification}
                      // setLoginNotification={setLoginNotification}
                    />
                  </PublicRoute>
                }
              />

              <Route
                // isAuthenticated={authContext.isAuthenticated}
                path="/user-profile"
                element={
                  // not possible to access if logged in!
                  <PrivateRoute isAuthenticated={authContext.isAuthenticated}>
                    <UserProfile
                      mainPaddingRight={paddingRight}
                      scrollbarWidth={scrollbarWidth}
                      globalSettings={globalSettings}
                      // loginNotification={loginNotification}
                      // setLoginNotification={setLoginNotification}
                    />
                  </PrivateRoute>
                }
              />

              <Route
                // isAuthenticated={authContext.isAuthenticated}
                path="/passforgot"
                element={
                  // not possible to access if logged in!
                  <PublicRoute isAuthenticated={authContext.isAuthenticated}>
                    <PasswordForgotten
                      mainPaddingRight={paddingRight}
                      scrollbarWidth={scrollbarWidth}
                      globalSettings={globalSettings}
                      // loginNotification={loginNotification}
                      // setLoginNotification={setLoginNotification}
                    />
                  </PublicRoute>
                }
              />

              <Route
                // isAuthenticated={authContext.isAuthenticated}
                path="/passforgot-change/:token"
                element={
                  // not possible to access if logged in!
                  <PublicRoute isAuthenticated={authContext.isAuthenticated}>
                    <ForgottenPassChange
                      mainPaddingRight={paddingRight}
                      scrollbarWidth={scrollbarWidth}
                      globalSettings={globalSettings}
                      // loginNotification={loginNotification}
                      // setLoginNotification={setLoginNotification}
                    />
                  </PublicRoute>
                }
              />

              {/* <Route
                  path="login-register"
                  element={
                    <LoginRegister
                      mainPaddingRight={paddingRight}
                      scrollbarWidth={scrollbarWidth}
                      globalSettings={globalSettings}
                    />
                  }
                /> */}

              {/* <Route path="invoices" element={<Invoices />} /> */}
              {/* </Route> */}
            </Routes>
          </BrowserRouter>
        </UpperUiContext.Provider>
      </BackgroundImgContext.Provider>
    </DbContext.Provider>
    // </AuthContext.Provider>
  );
}

export default Main;
