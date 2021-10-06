import React, { useState, useReducer, useEffect } from "react";

import shallow from "zustand/shallow";
import { useQuery } from "urql";

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

import { SettingsQuery } from "../graphql/graphqlQueries";
import { testUserId } from "../state/data/testUserId";

import { SettingsDatabase_i } from "../../../schema/types/settingsType";

function Main(): JSX.Element {
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

  const [settingsResults] = useQuery({
    query: SettingsQuery,
    variables: { userId: testUserId },
  });

  const { data, fetching, error } = settingsResults;

  

  let globalSettings: SettingsDatabase_i = data.settings;

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

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  let paddingProps = {
    mainPaddingRight: paddingRight,
    scrollbarWidth,
  }

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
          <ModalWrap>
            <NewTab tabType={tabType} {...paddingProps} />
          </ModalWrap>
        )}
        {upperVisState.newBookmarkVis && (
          <ModalWrap>
            <Bookmark_newAndEdit
              bookmarkComponentType={"new_upperUI"}
              {...paddingProps}
            />
          </ModalWrap>
        )}
        {upperVisState.backgroundSettingsVis && (
          <ModalWrap>
            <BackgroundSettings {...paddingProps}/>
          </ModalWrap>
        )}
        {upperVisState.settingsVis && (
          <ModalWrap>
            <GlobalSettings {...paddingProps} />
          </ModalWrap>
        )}
        {upperVisState.colorsSettingsVis && (
          <ModalWrap>
            <ColorsSettings {...paddingProps} />
          </ModalWrap>
        )}
        {upperVisState.profileVis && (
          <ModalWrap>
            <Profile {...paddingProps} />
          </ModalWrap>
        )}

        <UpperUI />
        <Grid setTabType={setTabType} />
      </main>
    </UpperUiContext.Provider>
  );
}

export default Main;
