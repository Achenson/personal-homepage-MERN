import React, { useState, useReducer, useEffect, Children } from "react";
import { useQuery } from "urql";

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
import { useBackgroundColor } from "../state/hooks/colorHooks";

import { initUpperVisState } from "../context/upperVisInitState";
import { upperVisReducer } from "../context/upperVisReducer";
import { useWindowSize } from "../utils/funcs and hooks/useWindowSize";
import { UpperUiContext } from "../context/upperUiContext";

import { SettingsDatabase_i } from "../../../schema/types/settingsType";
import { TabsQuery } from "../graphql/graphqlQueries";

import { testUserId } from "../state/data/testUserId";

import { SingleTabData } from "../utils/interfaces";

interface Props {
  globalSettings: SettingsDatabase_i;
}

function Main({ globalSettings }: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  const backgroundColor = useBackgroundColor((state) => state.backgroundColor);

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

  const [tabResults] = useQuery({
    query: TabsQuery,
    variables: { userId: testUserId },
  });

  const {
    data: data_tabs,
    fetching: fetching_tabs,
    error: error_tabs,
  } = tabResults;

  if (fetching_tabs) return <p>Loading...</p>;
  if (error_tabs) return <p>Oh no... {error_tabs.message}</p>;

  let tabs: SingleTabData[] = data_tabs.tabs;

  let paddingProps = {
    mainPaddingRight: paddingRight,
    scrollbarWidth,
  };

  return (
    <UpperUiContext.Provider value={upperUiValue}>
      <main
        className={`relative min-h-screen ${
          globalSettings.picBackground
            ? `bg-${globalSettings.defaultImage}`
            : `bg-${backgroundColor}`
        } bg-cover bg-fixed`}
        style={{
          paddingRight: `${
            paddingRight && !globalSettings.picBackground
              ? `${scrollbarWidth}px`
              : ""
          }`,
        }}
      >
        {upperVisState.newTabVis && (
          <ModalWrap globalSettings={globalSettings}>
            <NewTab tabType={tabType} tabs={tabs} {...paddingProps} />
          </ModalWrap>
        )}
        {upperVisState.newBookmarkVis && (
          <ModalWrap globalSettings={globalSettings}>
            <Bookmark_newAndEdit
              bookmarkComponentType={"new_upperUI"}
              tabs={tabs}
              {...paddingProps}
            />
          </ModalWrap>
        )}
        {upperVisState.backgroundSettingsVis && (
          <ModalWrap globalSettings={globalSettings}>
            <BackgroundSettings {...paddingProps} />
          </ModalWrap>
        )}
        {upperVisState.settingsVis && (
          <ModalWrap globalSettings={globalSettings}>
            <GlobalSettings {...paddingProps} />
          </ModalWrap>
        )}
        {upperVisState.colorsSettingsVis && (
          <ModalWrap globalSettings={globalSettings}>
            <ColorsSettings {...paddingProps} />
          </ModalWrap>
        )}
        {upperVisState.profileVis && (
          <ModalWrap globalSettings={globalSettings}>
            <Profile {...paddingProps} />
          </ModalWrap>
        )}

        <UpperUI />
        <Grid
          setTabType={setTabType}
          globalSettings={globalSettings}
          tabs={tabs}
        />
      </main>
    </UpperUiContext.Provider>
  );
}

export default Main;
