import React from "react";

import shallow from "zustand/shallow";
import { useQuery } from "urql";

import Tab from "./Tab";
import GapAfterTab from "./GapAfterTab";
import UpperLeftMenu from "../UpperUI/UpperLeftMenu";
import UpperRightMenu from "../UpperUI/UpperRightMenu";
import Message from "../UpperUI/Message";

import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import {
  useColumnsColors,
  useColumnsColorsImg,
} from "../../state/hooks/colorHooks";

// import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { SingleTabData } from "../../utils/interfaces";

interface Props {
  colNumber: number;
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  breakpoint: 0 | 1 | 2 | 3 | 4 | null;
}

function Column({ colNumber, setTabType, breakpoint }: Props): JSX.Element {
  const columnsColors = useColumnsColors((state) => state, shallow);
  const columnsColorsImg = useColumnsColorsImg((state) => state, shallow);

  const TabsQuery = `query ($userId: ID) {
    tabs (userId: $userId) {
      id
      userId
      title
      color
      column
      priority
      opened
      openedByDefault
      deletable
      type
      noteInput
      rssLink
      date
      description
      itemsPerPage
    }
  }`;

  // const tabs = useTabs((store) => store.tabs);
  const [tabResults] = useQuery({
    query: TabsQuery,
    variables: { userId: "6154708145808b7678b78762" },
  });

  const { data, fetching, error } = tabResults;

  const globalSettings = useGlobalSettings((state) => state, shallow);

  const upperUiContext = useUpperUiContext();

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  let tabs = data.tabs;

  function calcColumnColor(
    colNumber: number,
    picBackground: boolean,
    oneColorForAllColumns: boolean
  ) {
    if (!picBackground) {
      return "";
    }

    if (oneColorForAllColumns) {
      return columnsColorsImg.column_1;
    }

    switch (colNumber) {
      case 1:
        return columnsColorsImg.column_1;
      case 2:
        return columnsColorsImg.column_2;
      case 3:
        return columnsColorsImg.column_3;
      case 4:
        return columnsColorsImg.column_4;
    }
  }

  function calcColumnColor_picBackground(
    colNumber: number,
    picBackground: boolean,
    oneColorForAllColumns: boolean
  ) {
    if (picBackground) {
      return "";
    }

    if (oneColorForAllColumns) {
      return "bg-" + columnsColors.column_1;
    }

    switch (colNumber) {
      case 1:
        return "bg-" + columnsColors.column_1;
      case 2:
        return "bg-" + columnsColors.column_2;
      case 3:
        return "bg-" + columnsColors.column_3;
      case 4:
        return "bg-" + columnsColors.column_4;
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
       ${calcColumnColor_picBackground(
         colNumber,
         globalSettings.picBackground,
         globalSettings.oneColorForAllCols
       )}`}
      style={{
        backgroundColor: calcColumnColor(
          colNumber,
          globalSettings.picBackground,
          globalSettings.oneColorForAllCols
        ),
      }}
    >
      {(tabs as SingleTabData[])
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
              />
              {/* <div className="flex-grow"> */}
              <GapAfterTab
                colNumber={colNumber}
                tabID_orNull={el.id}
                picBackground={globalSettings.picBackground}
                isThisLastGap={isThisLastGap(lastTabId, el.id)}
                isThisTheOnlyGap={false}
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
          <UpperLeftMenu />
        </div>
      )}

      {shouldRightUiRender(breakpoint) && (
        <div>
          <div
            className="absolute"
            style={{
              top:
                upperUiContext.upperVisState.addTagVis_xs &&
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
            <UpperRightMenu setTabType={setTabType} />
          </div>
          {upperUiContext.upperVisState.messagePopup && <Message />}
        </div>
      )}
    </div>
  );
}

export default Column;
