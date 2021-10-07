import React, { useEffect, useState, useCallback } from "react";

import FocusLock from "react-focus-lock";
import shallow from "zustand/shallow";

import SingleColor_DefaultAndColumn from "./SingleColor_DefaultAndColumn";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import {
  useDefaultColors,
  useColumnsColors,
  useColumnsColorsImg,
} from "../../state/hooks/colorHooks";

import { useUpperUiContext } from "../../context/upperUiContext";

import { tabColors, tabColorsConcat } from "../../utils/data/colors_tab";
import {
  columnColors,
  imageColumnColors,
  columnColorsConcat,
  imageColumnColorsConcat,
} from "../../utils/data/colors_column";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

interface Props {
  defaultColorsFor:
    | "folders"
    | "notes"
    | "rss"
    | "column_1"
    | "column_2"
    | "column_3"
    | "column_4"
    | "unselected";
  setColorsToChooseVis?: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusOnColumnColor?: React.Dispatch<
    React.SetStateAction<null | 1 | 2 | 3 | 4>
  >;
  globalSettings: SettingsDatabase_i
}

function ColorsToChoose_DefaultAndColumns({
  defaultColorsFor,
  setColorsToChooseVis,
  setFocusOnColumnColor,
  globalSettings
}: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  const defaultColors = useDefaultColors((state) => state, shallow);

  const columnsColors = useColumnsColors((state) => state, shallow);
  const columnsColorsImg = useColumnsColorsImg((state) => state, shallow);

  const calcSelectedNumber = useCallback((): number => {
    let selectedNumber: number = 0;

    if (/column/.test(defaultColorsFor)) {
      if (globalSettings.picBackground) {
        imageColumnColorsConcat.forEach((color, i) => {
          switch (defaultColorsFor) {
            case "column_1":
              if (color === columnsColorsImg.column_1) {
                selectedNumber = calcColorNumbering(
                  color,
                  imageColumnColorsConcat
                );
              }
              break;
            case "column_2":
              if (color === columnsColorsImg.column_2) {
                selectedNumber = calcColorNumbering(
                  color,
                  imageColumnColorsConcat
                );
              }
              break;
            case "column_3":
              if (color === columnsColorsImg.column_3) {
                selectedNumber = calcColorNumbering(
                  color,
                  imageColumnColorsConcat
                );
              }
              break;
            case "column_4":
              if (color === columnsColorsImg.column_4) {
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
            case "column_1":
              if (color === columnsColors.column_1) {
                selectedNumber = calcColorNumbering(color, columnColorsConcat);
              }
              break;
            case "column_2":
              if (color === columnsColors.column_2) {
                selectedNumber = calcColorNumbering(color, columnColorsConcat);
              }
              break;
            case "column_3":
              if (color === columnsColors.column_3) {
                selectedNumber = calcColorNumbering(color, columnColorsConcat);
              }
              break;
            case "column_4":
              if (color === columnsColors.column_4) {
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
          if (color === defaultColors.folderColor) {
            selectedNumber = calcColorNumbering(color, tabColorsConcat);
          }
          break;

        case "notes":
          if (color === defaultColors.noteColor) {
            selectedNumber = calcColorNumbering(color, tabColorsConcat);
          }
          break;
        case "rss":
          if (color === defaultColors.rssColor) {
            selectedNumber = calcColorNumbering(color, tabColorsConcat);
          }
          break;
        default:
          selectedNumber = 0;
      }
    });

    return selectedNumber;
  }, [
    columnsColors.column_1,
    columnsColors.column_2,
    columnsColors.column_3,
    columnsColors.column_4,
    columnsColorsImg.column_1,
    columnsColorsImg.column_2,
    columnsColorsImg.column_3,
    columnsColorsImg.column_4,
    defaultColors.folderColor,
    defaultColors.noteColor,
    defaultColors.rssColor,
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
      if (/column/.test(defaultColorsFor)) {
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
          {/column/.test(defaultColorsFor)
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
