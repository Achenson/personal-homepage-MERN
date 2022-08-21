import React from "react";

import shallow from "zustand/shallow";

// import shallow from "zustand/shallow";

import Tab from "./Tab";
import GapAfterTab from "./GapAfterTab";
import UpperLeftMenu from "../UpperUI/UpperLeftMenu";
import UpperRightMenu from "../UpperUI/UpperRightMenu";
import Message from "../UpperUI/Message";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

// import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { useDbContext } from "../../context/dbContext";
// import { useAuthContext } from "../../context/authContext";
import { useAuth } from "../../state/hooks/useAuth";
import { useTabs } from "../../state/hooks/useTabs";
import {
  useGlobalSettings,
  UseGlobalSettingsAll,
} from "../../state/hooks/defaultSettingsHooks";

import { TabsQuery } from "../../graphql/graphqlQueries";
import { SettingsQuery } from "../../graphql/graphqlQueries";

// import { testUserId } from "../../state/data/testUserId";

import { SingleTabData } from "../../utils/interfaces";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { TabDatabase_i } from "../../../../schema/types/tabType";

interface Props {
  colNumber: number;
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  breakpoint: 0 | 1 | 2 | 3 | 4 | null;
  // tabs: SingleTabData[];
  // tabs: TabDatabase_i[];
  userIdOrNoId: string | null;
  globalSettingsDb: SettingsDatabase_i;
}

function Column({
  colNumber,
  setTabType,
  breakpoint,
  userIdOrNoId,
  globalSettingsDb
}: // tabs,
Props): JSX.Element {
  // const columnsColors = useColumnsColors((state) => state, shallow);
  // const columnsColorsImg = useColumnsColorsImg((state) => state, shallow);

  // const tabs = useTabs((store) => store.tabs);
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const tabsDb = useDbContext()?.tabs;

  const tabsNotAuth = useTabs((store) => store.tabs);

  const globalSettingsNotAuth = useGlobalSettings((state) => state, shallow);

  let tabs: TabDatabase_i[] | SingleTabData[];

  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const upperUiContext = useUpperUiContext();
  const authContext = useAuth();

  userIdOrNoId =
    authContext.authenticatedUserId && authContext.isAuthenticated
      ? authContext.authenticatedUserId
      : null;


  // const { data, fetching, error } = settingsResults;

  // if (fetching) return <p>Loading...</p>;
  // if (error) return <p>{error.message}</p>;

  // let globalSettings: SettingsDatabase_i = data.settings;
  let globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;

  globalSettings = userIdOrNoId
    // ? (data.settings as SettingsDatabase_i)
    ? globalSettingsDb
    : globalSettingsNotAuth;

  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  function calcColumnColor_picBackground(
    colNumber: number,
    picBackground: boolean,
    oneColorForAllColumns: boolean
  ) {
    if (!picBackground) {
      return "";
    }

    if (oneColorForAllColumns) {
      // return columnsColorsImg.colColor_1;
      return globalSettings.colColorImg_1;
    }

    switch (colNumber) {
      case 1:
        // return columnsColorsImg.colColor_1;
        return globalSettings.colColorImg_1;
      case 2:
        // return columnsColorsImg.colColor_2;
        return globalSettings.colColorImg_2;
      case 3:
        // return columnsColorsImg.colColor_3;
        return globalSettings.colColorImg_3;
      case 4:
        // return columnsColorsImg.colColor_4;
        return globalSettings.colColorImg_4;
    }
  }

  function calcColumnColor(
    colNumber: number,
    picBackground: boolean,
    oneColorForAllColumns: boolean
  ) {
    if (picBackground) {
      return "";
    }

    if (oneColorForAllColumns) {
      // return "bg-" + columnsColors.colColor_1;
      return "bg-" + globalSettings.colColor_1;
    }

    switch (colNumber) {
      case 1:
        // return "bg-" + columnsColors.colColor_1;
        return "bg-" + globalSettings.colColor_1;
      case 2:
        // return "bg-" + columnsColors.colColor_2;
        return "bg-" + globalSettings.colColor_2;
      case 3:
        return "bg-" + globalSettings.colColor_3;
      // return "bg-" + columnsColors.colColor_3;
      case 4:
        return "bg-" + globalSettings.colColor_4;
      // return "bg-" + columnsColors.colColor_4;
    }
  }

  let sortedTabs = (tabs as SingleTabData[])
    .filter((el) => el.column === colNumber)
    .sort((a, b) => a.priority - b.priority);

  let lastTabId: string | null;
  if (sortedTabs.length > 0) {
    lastTabId = sortedTabs[sortedTabs.length - 1].id;
  } else {
    lastTabId = null;
  }

  let tabDataLength = (tabs as SingleTabData[]).filter(
    (el) => el.column === colNumber
  ).length;

  function isThisLastGap(lastTabId: string | null, tabID: string) {
    if (lastTabId === tabID) {
      return true;
    }

    return false;
  }

  function bordersIfNoBackground() {
    return `border-black border-opacity-10 ${tabDataLength === 0 ? "" : ""}`;
  }

  function shouldRightUiRender(breakpoint: 0 | 1 | 2 | 3 | 4 | null): boolean {
    let nrOfCols = globalSettings.numberOfCols;

    switch (breakpoint) {
      case 4:
        return nrOfCols === colNumber ? true : false;
      case 3:
        return (nrOfCols >= 3 && colNumber === 3) ||
          (nrOfCols === 2 && colNumber === 2) ||
          (nrOfCols === 1 && colNumber === 1)
          ? true
          : false;
      case 2:
        return (nrOfCols >= 2 && colNumber === 2) ||
          (nrOfCols === 1 && colNumber === 1)
          ? true
          : false;
      case 1:
        return colNumber === 1 ? true : false;
      case 0:
        return colNumber === 1 ? true : false;
    }

    return false;
  }

  return (
    <div
      className={`h-full relative flex flex-col ${
        globalSettings.picBackground ? "" : bordersIfNoBackground()
      }
       ${calcColumnColor(
         colNumber,
         globalSettings.picBackground,
         globalSettings.oneColorForAllCols
       )}`}
      style={{
        backgroundColor: calcColumnColor_picBackground(
          colNumber,
          globalSettings.picBackground,
          globalSettings.oneColorForAllCols
        ),
      }}
    >
      {/* {(tabs as SingleTabData[]) */}
      {(tabs as TabDatabase_i[])
        .filter((el) => el.column === colNumber)
        // lower priority, higher in the column
        .sort((a, b) => a.priority - b.priority)
        .map((el, i) => {
          return (
            <div
              key={i}
              className={`flex flex-col ${
                isThisLastGap(lastTabId, el.id) ? "flex-grow" : ""
              }`}
            >
              <Tab
                tabID={el.id}
                tabTitle={el.title}
                tabColor={el.color}
                tabType={el.type}
                colNumber={el.column}
                tabOpened={el.opened}
                tabOpenedByDefault={el.openedByDefault}
                tabIsDeletable={el.deletable}
                globalSettings={globalSettings}
                // tabs={tabs}
                currentTab={el}
                userIdOrNoId={userIdOrNoId}
              />
              {/* <div className="flex-grow"> */}
              <GapAfterTab
                colNumber={colNumber}
                tabID_orNull={el.id}
                picBackground={globalSettings.picBackground}
                isThisLastGap={isThisLastGap(lastTabId, el.id)}
                isThisTheOnlyGap={false}
                globalSettings={globalSettings}
                userIdOrNoId={userIdOrNoId}
                tabIsDeletable={el.deletable}
              />
              {/* </div> */}
            </div>
          );
        })}

      {tabDataLength === 0 ? (
        <div className="flex-grow">
          <GapAfterTab
            colNumber={colNumber}
            tabID_orNull={null}
            picBackground={globalSettings.picBackground}
            isThisLastGap={true}
            isThisTheOnlyGap={true}
            globalSettings={globalSettings}
            userIdOrNoId={userIdOrNoId}
            tabIsDeletable={undefined}
          />
        </div>
      ) : null}

      {/* if this is the last columns */}
      {colNumber === 1 && (
        <div
          className="absolute"
          style={{
            top: "-32px",
          }}
        >
          <UpperLeftMenu
            globalSettings={globalSettings}
            userIdOrNoId={userIdOrNoId}
          />
        </div>
      )}

      {shouldRightUiRender(breakpoint) && (
        <div>
          <div
            className="absolute"
            style={{
              top:
                upperUiContext.upperVisState.addTabVis_xs &&
                (breakpoint === 0 ||
                  // when col growth is limited && colNumber is ===1, UpperRightMenu_XS is on all breakpoints
                  (globalSettings.limitColGrowth &&
                    globalSettings.numberOfCols === 1) ||
                  // when col growth is limited, UpperRightMenu_XS is both on xs: and sm: breakpoints
                  (breakpoint === 1 && globalSettings.limitColGrowth))
                  ? `-58px`
                  : "-30px",
              right: "0px",
            }}
          >
            <UpperRightMenu
              setTabType={setTabType}
              globalSettings={globalSettings}
            />
          </div>
          {authContext.messagePopup && (
            <Message globalSettings={globalSettings} />
          )}
        </div>
      )}
    </div>
  );
}

export default Column;
