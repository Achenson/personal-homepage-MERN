import React, { useState, useEffect } from "react";

import { UseQueryState, OperationContext } from "urql";

// import { BackgroundImgContext } from "../context/backgroundImgContext";

import Grid from "./LowerUI/Grid";
import Bookmark_newAndEdit from "./Shared/Bookmark_newAndEdit";
import NewTab from "./UpperUI/NewTab";
import ColorsSettings from "./UpperUI/ColorsSettings";
import UpperUI from "./UpperUI/UpperUI";
import BackgroundSettings from "./UpperUI/BackgroundSettings";
import GlobalSettings from "./UpperUI/GlobalSettings";
import ModalWrap from "./UpperUI/ModalWrap";

import { useAuth } from "../state/hooks/useAuth";


import { GlobalSettingsState, UpperVisState } from "../utils/interfaces";

import {
  TabsQuery,
  BookmarksQuery,
  BackgroundImgQuery,
} from "../graphql/graphqlQueries";


// } from "../utils/interfaces";

interface Props {
  globalSettings: GlobalSettingsState;
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  tabType: "folder" | "note" | "rss";
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  upperVisState: UpperVisState;
  paddingRight: boolean;
  userIdOrNoId: string | null;
  backgroundImgUrl: string | null;
  backgroundImgResults: UseQueryState<
    any,
    {
      userId: string | null;
    }
  >;
  reexecuteBackgroundImg: (
    opts?: Partial<OperationContext> | undefined
  ) => void;
  // setLoginNotification: React.Dispatch<React.SetStateAction<string | null>>
}

function MainRoute({
  globalSettings,
  mainPaddingRight,
  scrollbarWidth,
  tabType,
  setTabType,
  upperVisState,
  paddingRight,
  userIdOrNoId,
  backgroundImgUrl,
  backgroundImgResults,
  reexecuteBackgroundImg,
}: // setLoginNotification
Props): JSX.Element {
  const backgroundColor = globalSettings.backgroundColor;
  const setLoginNotification = useAuth((store) => store.setLoginNotification);

  useEffect(() => {
    setLoginNotification(null);
  }, []);

  let paddingProps = {
    mainPaddingRight,
    scrollbarWidth,
  };

  let authAndSettingsProps = {
    globalSettings,
    userIdOrNoId,
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
            // globalSettings={globalSettings}
            // mainPaddingRight={mainPaddingRight}
            // scrollbarWidth={scrollbarWidth}
            // userIdOrNoId={userIdOrNoId}
              {...paddingProps}
              {...authAndSettingsProps}
          
          />
        </ModalWrap>
      )}
      {upperVisState.newBookmarkVis && (
        <ModalWrap globalSettings={globalSettings}>
          <Bookmark_newAndEdit
            bookmarkComponentType={"new_upperUI"}
            // tabs={tabs}
            // bookmarks={bookmarks}
            // globalSettings={globalSettings}
            // userIdOrNoId={userIdOrNoId}
            //   {...paddingProps}
            {...authAndSettingsProps}
          />
        </ModalWrap>
      )}
      {upperVisState.backgroundSettingsVis && (
        <ModalWrap globalSettings={globalSettings}>
          <BackgroundSettings
            // globalSettings={globalSettings}
            backgroundImgResults={backgroundImgResults}
            reexecuteBackgroundImg={reexecuteBackgroundImg}
            // mainPaddingRight={mainPaddingRight}
            // scrollbarWidth={scrollbarWidth}
            // userIdOrNoId={userIdOrNoId}
              {...paddingProps}
              {...authAndSettingsProps}
          />
        </ModalWrap>
      )}
      {upperVisState.settingsVis && (
        <ModalWrap globalSettings={globalSettings}>
          <GlobalSettings
            // globalSettings={globalSettings}
            //   {...paddingProps}
            // mainPaddingRight={mainPaddingRight}
            // scrollbarWidth={scrollbarWidth}
            // userIdOrNoId={userIdOrNoId}
            {...paddingProps}
            {...authAndSettingsProps}
          />
        </ModalWrap>
      )}
      {upperVisState.colorsSettingsVis && (
        <ModalWrap globalSettings={globalSettings}>
          <ColorsSettings
            // globalSettings={globalSettings}
            //   +{...paddingProps}
            // mainPaddingRight={mainPaddingRight}
            // scrollbarWidth={scrollbarWidth}
            // userIdOrNoId={userIdOrNoId}
            {...paddingProps}
            {...authAndSettingsProps}
          />
        </ModalWrap>
      )}
      {/* {upperVisState.profileVis && (
      <ModalWrap globalSettings={globalSettings}>
        <Profile
          globalSettings={globalSettings}
          {...paddingProps}
        />
      </ModalWrap>
     )} */}
      <UpperUI />
      <Grid
        setTabType={setTabType}
        // globalSettings={globalSettings}
        // userIdOrNoId={userIdOrNoId}
        {...authAndSettingsProps}
        // bookmarks={bookmarks}
        // tabs={tabs}
      />
    </main>
  );
}

export default MainRoute;
