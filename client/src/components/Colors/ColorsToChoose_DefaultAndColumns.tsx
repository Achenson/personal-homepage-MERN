import React, { useEffect, useState, useCallback } from "react";

import FocusLock from "react-focus-lock";
import shallow from "zustand/shallow";

import SingleColor_DefaultAndColumn from "./SingleColor_DefaultAndColumn";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
/* import {
  useDefaultColors,
  useColumnsColors,
  useColumnsColorsImg,
} from "../../state/hooks/colorHooks"; */

import { useUpperUiContext } from "../../context/upperUiContext";

import { tabColors, tabColorsConcat } from "../../utils/data/colors_tab";
import {
  columnColors,
  imageColumnColors,
  columnColorsConcat,
  imageColumnColorsConcat,
} from "../../utils/data/colors_column";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";

interface Props {
  defaultColorsFor:
    | "folders"
    | "notes"
    | "rss"
    | "colColor_1"
    | "colColor_2"
    | "colColor_3"
    | "colColor_4"
    | "unselected";
  setColorsToChooseVis?: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusOnColumnColor?: React.Dispatch<
    React.SetStateAction<null | 1 | 2 | 3 | 4>
  >;
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
  userIdOrNoId: string | null;
}

function ColorsToChoose_DefaultAndColumns({
  defaultColorsFor,
  setColorsToChooseVis,
  setFocusOnColumnColor,
  globalSettings,
  userIdOrNoId
}: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  // const defaultColors = useDefaultColors((state) => state, shallow);
  // const columnsColors = useColumnsColors((state) => state, shallow);
  // const columnsColorsImg = useColumnsColorsImg((state) => state, shallow);

  const calcSelectedNumber = useCallback((): number => {
    let selectedNumber: number = 0;

    if (/colColor/.test(defaultColorsFor)) {
      if (globalSettings.picBackground) {
        imageColumnColorsConcat.forEach((color, i) => {
          switch (defaultColorsFor) {
            case "colColor_1":
              if (color === globalSettings.colColorImg_1) {
                selectedNumber = calcColorNumbering(
                  color,
                  imageColumnColorsConcat
                );
              }
              break;
            case "colColor_2":
              if (color === globalSettings.colColorImg_2) {
                selectedNumber = calcColorNumbering(
                  color,
                  imageColumnColorsConcat
                );
              }
              break;
            case "colColor_3":
              if (color === globalSettings.colColorImg_3) {
                selectedNumber = calcColorNumbering(
                  color,
                  imageColumnColorsConcat
                );
              }
              break;
            case "colColor_4":
              if (color === globalSettings.colColorImg_4) {
                selectedNumber = calcColorNumbering(
                  color,
                  imageColumnColorsConcat
                );
              }
              break;
            default:
              selectedNumber = 0;
          }
        });
      }

      if (!globalSettings.picBackground) {
        columnColorsConcat.forEach((color, i) => {
          switch (defaultColorsFor) {
            case "colColor_1":
              if (color === globalSettings.colColor_1) {
                selectedNumber = calcColorNumbering(color, columnColorsConcat);
              }
              break;
            case "colColor_2":
              if (color === globalSettings.colColor_2) {
                selectedNumber = calcColorNumbering(color, columnColorsConcat);
              }
              break;
            case "colColor_3":
              if (color === globalSettings.colColor_3) {
                selectedNumber = calcColorNumbering(color, columnColorsConcat);
              }
              break;
            case "colColor_4":
              if (color === globalSettings.colColor_4) {
                selectedNumber = calcColorNumbering(color, columnColorsConcat);
              }
              break;
            default:
              selectedNumber = 0;
          }
        });
      }
      return selectedNumber;
    }

    tabColorsConcat.forEach((color, i) => {
      switch (defaultColorsFor) {
        case "folders":
          if (color === globalSettings.folderColor) {
            selectedNumber = calcColorNumbering(color, tabColorsConcat);
          }
          break;

        case "notes":
          if (color === globalSettings.noteColor) {
            selectedNumber = calcColorNumbering(color, tabColorsConcat);
          }
          break;
        case "rss":
          if (color === globalSettings.rssColor) {
            selectedNumber = calcColorNumbering(color, tabColorsConcat);
          }
          break;
        default:
          selectedNumber = 0;
      }
    });

    return selectedNumber;
  }, [
    globalSettings.colColor_1,
    globalSettings.colColor_2,
    globalSettings.colColor_3,
    globalSettings.colColor_4,
    globalSettings.colColorImg_1,
    globalSettings.colColorImg_2,
    globalSettings.colColorImg_3,
    globalSettings.colColorImg_4,
    globalSettings.folderColor,
    globalSettings.noteColor,
    globalSettings.rssColor,
    defaultColorsFor,
    globalSettings.picBackground,
  ]);

  const [selectedNumber, setSelectedNumber] = useState(calcSelectedNumber());

  const upperUiContext = useUpperUiContext();

  useEffect(() => {
    setSelectedNumber(calcSelectedNumber());
  }, [defaultColorsFor, calcSelectedNumber]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (event.code === "Escape") {
      if (/colColor/.test(defaultColorsFor)) {
        if (upperUiContext.upperVisState.columnSelected !== null) {
          upperUiContext.upperVisDispatch({ type: "COLORS_COLUMN_TOGGLE" });
        }
        if (setFocusOnColumnColor) {
          setFocusOnColumnColor(
            // @ts-ignore
            parseInt(defaultColorsFor.slice(defaultColorsFor.length - 1))
          );
        }
      }
      // for upperUI colorSettings
      if (setColorsToChooseVis) {
        setColorsToChooseVis(false);
      }
    }
  }

  function calcColorNumbering(
    color: string,
    arrOfConcatedColors: string[]
  ): number {
    // +1 because tabIndex for focus starts with one
    return arrOfConcatedColors.indexOf(color) + 1;
  }

  function mapTabColors() {
    return tabColors.map((row, i) => {
      return (
        <div className="flex" key={i}>
          {row.map((el, j) => {
            return (
              <SingleColor_DefaultAndColumn
                color={el}
                defaultColorsFor={defaultColorsFor}
                key={j}
                colorNumber={calcColorNumbering(el, tabColorsConcat)}
                selectedNumber={selectedNumber}
                setSelectedNumber={setSelectedNumber}
                colorArrLength={tabColorsConcat.length}
                globalSettings={globalSettings}
                userIdOrNoId={userIdOrNoId}
              />
            );
          })}
        </div>
      );
    });
  }

  function mapColumnColors(arrToMap: string[][]) {
    return arrToMap.map((row, i) => {
      return (
        <div className="flex" key={i}>
          {row.map((el, j) => {
            return (
              <SingleColor_DefaultAndColumn
                color={el}
                defaultColorsFor={defaultColorsFor}
                key={j}
                colsForBackgroundImg={
                  globalSettings.picBackground ? true : false
                }
                colorNumber={
                  globalSettings.picBackground
                    ? calcColorNumbering(el, imageColumnColorsConcat)
                    : calcColorNumbering(el, columnColorsConcat)
                }
                selectedNumber={selectedNumber}
                setSelectedNumber={setSelectedNumber}
                colorArrLength={
                  globalSettings.picBackground
                    ? imageColumnColorsConcat.length
                    : columnColorsConcat.length
                }
                globalSettings={globalSettings}
                userIdOrNoId={userIdOrNoId}
              />
            );
          })}
        </div>
      );
    });
  }

  return (
    <FocusLock>
      <div className="z-50 relative">
        <div className="absolute bg-white">
          {/colColor/.test(defaultColorsFor)
            ? mapColumnColors(
                globalSettings.picBackground ? imageColumnColors : columnColors
              )
            : mapTabColors()}
        </div>
      </div>
    </FocusLock>
  );
}

export default ColorsToChoose_DefaultAndColumns;
