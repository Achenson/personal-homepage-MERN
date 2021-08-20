import React from "react";

import {
  useDefaultColors,
  useColumnsColors,
  useColumnsColorsImg,
} from "../../state/hooks/colorHooks";

import { setComplementaryUiColor } from "../../utils/funcs and hooks/complementaryUIcolor";
import { tabColorsLightFocus } from "../../utils/data/colors_tab";

interface Props {
  color: string;
  defaultColorsFor:
    | "folders"
    | "notes"
    | "rss"
    | "column_1"
    | "column_2"
    | "column_3"
    | "column_4"
    | "unselected";
  colsForBackgroundImg?: boolean;
  selectedNumber: number;
  colorNumber: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<number>>;
  colorArrLength: number;
}

function SingleColor_DefaultAndColumn({
  color,
  defaultColorsFor,
  colsForBackgroundImg,
  selectedNumber,
  colorNumber,
  setSelectedNumber,
  colorArrLength,
}: Props): JSX.Element {
  const setDefaultColors = useDefaultColors((state) => state.setDefaultColors);
  const setColumnsColors = useColumnsColors((state) => state.setColumsColors);
  const setColumnsColorsImg = useColumnsColorsImg(
    (state) => state.setColumsColors
  );

  function borderMaker(
    defaultColorsFor:
      | "folders"
      | "notes"
      | "rss"
      | "column_1"
      | "column_2"
      | "column_3"
      | "column_4"
      | "unselected"
  ) {
    const unselected = "border border-black";
    const selectedBlack = "border-2 border-black";
    const selectedWhite = "border-2 border-white z-50";

    if (colorNumber !== selectedNumber) {
      return unselected;
    }

    switch (defaultColorsFor) {
      case "folders":
        return selectedWhite;
      case "notes":
        return selectedWhite;
      case "rss":
        return selectedWhite;
      case "column_1":
        return selectedBlack;
      case "column_2":
        return selectedBlack;
      case "column_3":
        return selectedBlack;
      case "column_4":
        return selectedBlack;
      default:
        return unselected;
    }
  }

  function focusColor(): string {
    // for column colors
    if (/column/.test(defaultColorsFor)) {
      if (colsForBackgroundImg) {
        return "blueGray-500";
      }
      return "blueGray-400";
    }
    // for tab defuault colors
    if (tabColorsLightFocus.indexOf(color) > -1) {
      return "gray-400";
    }

    return "gray-500";
  }

  let tabIndex = calcTabIndex();

  function calcTabIndex() {
    let indexToReturn = colorNumber - selectedNumber + 1;

    if (indexToReturn >= 1) {
      return indexToReturn;
    }

    return colorArrLength - selectedNumber + colorNumber + 1;
  }

  return (
    <button
      className={`h-4 ${
        defaultColorsFor === "folders" ||
        defaultColorsFor === "rss" ||
        defaultColorsFor === "notes"
          ? "w-8"
          : "w-6 xs:w-8"
      } -mr-px -mt-px bg-${color} cursor-pointer ${borderMaker(
        defaultColorsFor
      )} hover:border-2 hover:border-gray-500 hover:z-50
      focus:outline-none focus-visible:ring-2 ring-${focusColor()} ring-inset
      `}
      // for columns with background img only
      style={{ backgroundColor: `${colsForBackgroundImg ? color : ""}` }}
      onClick={() => {
        if (defaultColorsFor === "folders") {
          setDefaultColors({ key: "folderColor", color: color });
          setDefaultColors({
            key: "uiColor",
            color: setComplementaryUiColor(color),
          });
        }

        if (defaultColorsFor === "notes") {
          setDefaultColors({ key: "noteColor", color: color });
        }

        if (defaultColorsFor === "rss") {
          setDefaultColors({ key: "rssColor", color: color });
        }

        if (/column/.test(defaultColorsFor) && !colsForBackgroundImg) {
          setColumnsColors({
            key: defaultColorsFor as
              | "column_1"
              | "column_2"
              | "column_3"
              | "column_4",
            color: color,
          });
        }

        if (/column/.test(defaultColorsFor) && colsForBackgroundImg) {
          setColumnsColorsImg({
            key: defaultColorsFor as
              | "column_1"
              | "column_2"
              | "column_3"
              | "column_4",
            color: color,
          });
        }

        setSelectedNumber(colorNumber);
      }}
      tabIndex={tabIndex}
      aria-label={"Choose color"}
    ></button>
  );
}

export default SingleColor_DefaultAndColumn;
