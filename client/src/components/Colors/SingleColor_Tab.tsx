import React from "react";

import { tabColorsLightFocus } from "../../utils/data/colors_tab";
import { useTabs } from "../../state/hooks/useTabs";

interface Props {
  color: string;
  tabID: number | string;
  tabColor: string | null;
  tabType: "folder" | "note" | "rss";
  selectedNumber: number;
  colorNumber: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<number>>;
  colorArrLength: number;
}

function SingleColor_Tab({
  color,
  tabID,
  selectedNumber,
  colorNumber,
  setSelectedNumber,
  colorArrLength,
}: Props): JSX.Element {

  const setTabColor = useTabs(state => state.setTabColor)

  let tabIndex = calcTabIndex();

  function calcTabIndex() {
    let indexToReturn = colorNumber - selectedNumber + 1;

    if (indexToReturn >= 1) {
      return indexToReturn;
    }

    return colorArrLength - selectedNumber + colorNumber + 1;
  }

  function focusColor(): string {
    if (tabColorsLightFocus.indexOf(color) > -1) {
      return "gray-400";
    }

    return "gray-500";
  }

  return (
    <button
      className={`h-4 w-8 -mr-px -mt-px bg-${color} cursor-pointer ${
        colorNumber === selectedNumber
          ? "border-2 border-white z-50"
          : "border border-black"
      } hover:border-2 hover:border-gray-500 hover:z-50
      focus:outline-none focus-visible:ring-2 ring-${focusColor()} ring-inset
      `}
      onClick={() => {
        setTabColor(color, tabID);
        setSelectedNumber(colorNumber);
      }}

      tabIndex={tabIndex}
      aria-label={"Choose color"}
    ></button>
  );
}

export default SingleColor_Tab;
