import React from "react";

import { useMutation } from "urql";

/* import {
  useDefaultColors,
  useColumnsColors,
  useColumnsColorsImg,
} from "../../state/hooks/colorHooks"; */

import { setComplementaryUiColor } from "../../utils/funcs and hooks/complementaryUIcolor";
import { tabColorsLightFocus } from "../../utils/data/colors_tab";

import { ChangeSettingsMutation } from "../../graphql/graphqlMutations";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

interface Props {
  color: string;
  defaultColorsFor:
    | "folders"
    | "notes"
    | "rss"
    | "colColor_1"
    | "colColor_2"
    | "colColor_3"
    | "colColor_4"
    | "unselected";
  colsForBackgroundImg?: boolean;
  selectedNumber: number;
  colorNumber: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<number>>;
  colorArrLength: number;
  globalSettings: SettingsDatabase_i;
}

function SingleColor_DefaultAndColumn({
  color,
  defaultColorsFor,
  colsForBackgroundImg,
  selectedNumber,
  colorNumber,
  setSelectedNumber,
  colorArrLength,
  globalSettings
}: Props): JSX.Element {
  // const setDefaultColors = useDefaultColors((state) => state.setDefaultColors);
 /*  const setColumnsColors = useColumnsColors((state) => state.setColumnsColors);
  const setColumnsColorsImg = useColumnsColorsImg(
    (state) => state.setColumsColors
  ); */

  const [changeSettingsResult, changeSettings] = useMutation<any, SettingsDatabase_i>(
    ChangeSettingsMutation
  );

  function borderMaker(
    defaultColorsFor:
      | "folders"
      | "notes"
      | "rss"
      | "colColor_1"
      | "colColor_2"
      | "colColor_3"
      | "colColor_4"
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
      case "colColor_1":
        return selectedBlack;
      case "colColor_2":
        return selectedBlack;
      case "colColor_3":
        return selectedBlack;
      case "colColor_4":
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
          // setDefaultColors({ key: "folderColor", color: color });
          // setDefaultColors({
          //   key: "uiColor",
          //   color: setComplementaryUiColor(color),
          // });
          changeSettings({...globalSettings, folderColor: color, uiColor: setComplementaryUiColor(color) })
        }

        if (defaultColorsFor === "notes") {
          // setDefaultColors({ key: "noteColor", color: color });
          changeSettings({...globalSettings, noteColor: color})
        }

        if (defaultColorsFor === "rss") {
          // setDefaultColors({ key: "rssColor", color: color });
          changeSettings({...globalSettings, rssColor: color})
        }

        if (/colColor/.test(defaultColorsFor) && !colsForBackgroundImg) {
         /*  setColumnsColors({
            key: defaultColorsFor as
              | "colColor_1"
              | "colColor_2"
              | "colColor_3"
              | "colColor_4",
            color: color,
          }); */
          changeSettings({...globalSettings, [defaultColorsFor]: color })

        }

        if (/colColor/.test(defaultColorsFor) && colsForBackgroundImg) {
   /*        setColumnsColorsImg({
            key: defaultColorsFor as
              | "colColor_1"
              | "colColor_2"
              | "colColor_3"
              | "colColor_4",
            color: color,
          }); */
          changeSettings({...globalSettings, [defaultColorsFor]: color})
        }

        setSelectedNumber(colorNumber);
      }}
      tabIndex={tabIndex}
      aria-label={"Choose color"}
    ></button>
  );
}

export default SingleColor_DefaultAndColumn;
